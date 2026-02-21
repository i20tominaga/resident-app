import { User, ConstructionEvent, RelevanceScore } from './types';

/**
 * Calculate relevance score for each event based on user's profile
 * Considers: floor/unit proximity, facilities of interest, time preferences, etc.
 */
export function calculateRelevanceScores(
  user: User,
  events: ConstructionEvent[]
): RelevanceScore[] {
  return events.map(event => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Check if event affects user's floor
    if (user.floorNumber && event.affectedFloors.includes(user.floorNumber)) {
      score += 40;
      reasons.push('あなたのフロアの工事です');
    } else if (user.floorNumber && isFloorProximate(user.floorNumber, event.affectedFloors)) {
      score += 20;
      reasons.push('近いフロアの工事です');
    }

    // 2. Check if event affects user's facilities of interest
    const affectingFacilities = event.affectedFacilities.filter(
      fac => user.facilitiesOfInterest.includes(fac)
    );
    if (affectingFacilities.length > 0) {
      score += 30;
      reasons.push(`あなたが利用する施設に関連しています`);
    }

    // 3. Check if event timing matches user's time preferences
    if (event.startTime && event.endTime) {
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);

      for (const pref of user.timePreferences) {
        if (isTimeOverlap(pref.startHour, pref.endHour, eventStartHour, eventEndHour)) {
          score += 15;
          reasons.push(`${pref.label}の時間帯の工事です`);
          break;
        }
      }
    }

    // 4. High noise events get higher relevance
    if (event.noiseLevel === 'high') {
      score += 10;
      reasons.push('高い騒音が予想されます');
    }

    // 5. Access restriction events
    if (event.accessRestrictions) {
      score += 5;
      reasons.push('アクセス制限がある工事です');
    }

    // 6. Boost for ongoing events
    if (event.status === 'in_progress') {
      score += 15;
      reasons.push('現在進行中の工事です');
    }

    return {
      eventId: event.id,
      score: Math.min(score, 100),
      reasons,
    };
  }).sort((a, b) => b.score - a.score);
}

/**
 * Filter events based on user relevance
 * Returns events with score above threshold, prioritized by relevance
 */
export function getPersonalizedEvents(
  user: User,
  events: ConstructionEvent[],
  minRelevanceScore: number = 20
): ConstructionEvent[] {
  const relevanceScores = calculateRelevanceScores(user, events);
  const relevantEventIds = new Set(
    relevanceScores
      .filter(rs => rs.score >= minRelevanceScore)
      .map(rs => rs.eventId)
  );

  return events
    .filter(event => relevantEventIds.has(event.id))
    .sort((a, b) => {
      const scoreA = relevanceScores.find(rs => rs.eventId === a.id)?.score || 0;
      const scoreB = relevanceScores.find(rs => rs.eventId === b.id)?.score || 0;
      return scoreB - scoreA;
    });
}

/**
 * Check if a floor is proximate to affected floors (within 2 floors)
 */
function isFloorProximate(userFloor: number, affectedFloors: number[]): boolean {
  if (affectedFloors.length === 0) return false;
  return affectedFloors.some(floor => Math.abs(floor - userFloor) <= 2);
}

/**
 * Check if time ranges overlap
 */
function isTimeOverlap(
  pref1Start: number,
  pref1End: number,
  pref2Start: number,
  pref2End: number
): boolean {
  return !(pref1End <= pref2Start || pref2End <= pref1Start);
}

/**
 * Get upcoming events sorted by date
 */
export function getUpcomingEvents(events: ConstructionEvent[]): ConstructionEvent[] {
  const now = new Date();
  return events
    .filter(event => event.startDate > now && event.status === 'scheduled')
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

/**
 * Get ongoing events
 */
export function getOngoingEvents(events: ConstructionEvent[]): ConstructionEvent[] {
  const now = new Date();
  return events
    .filter(event => {
      return event.status === 'in_progress' &&
             event.startDate <= now &&
             event.endDate >= now;
    })
    .sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
}

/**
 * Get events in next N days
 */
export function getEventsInNextDays(
  events: ConstructionEvent[],
  days: number = 7
): ConstructionEvent[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return events
    .filter(event => event.startDate <= futureDate && event.startDate >= now)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}
