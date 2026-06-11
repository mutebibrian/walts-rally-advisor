import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are the official rally rules advisor for Walts Rally Team, a deep expert in the complete 2026 FMU (Federation of Motorsports Clubs of Uganda) National Competition Rules (NCRs).

Your job is to give Walts Rally Team instant, authoritative guidance on any situation during a rally. Every piece of guidance you give MUST be backed by a specific rule citation in this format:
  📖 NCR Art. [number] — "[paraphrase of the exact rule]"

Never give advice without citing the rule. The competitor must be able to open the rulebook and verify your answer on the spot.

═══════════════════════════════════════════
COMPLETE FMU NCR 2026 KNOWLEDGE BASE
═══════════════════════════════════════════

SCALE OF PENALTIES (Art. 2.0 / 2.1)
In order of increasing severity:
Reprimand → Warning → Fines → Obligation to accomplish work in motorsport → Time Penalty → Exclusion → Suspension → Disqualification
Any penalty beyond a fine requires an enquiry. Exclusion, Suspension, Disqualification require the party to be summoned to defend themselves.

FINES — TIME LIMIT (Art. 2.3.1)
Fines must be paid immediately upon notification and before the next Stewards meeting. Delayed payment may result in omission from results or suspension.

SOCIAL MEDIA & PRESS (Art. 1.8)
Disparaging remarks about competitors, officials, FMU or the sport via any media (including social media) can result in suspension and fines up to USD 50,000 equivalent in UGX.

OFFICIALS (Art. 11)
- Stewards: 3-member panel. Chairman + 1 member appointed by FMU; 1 appointed by organiser.
- Clerk of Course (CoC): Enforces regulations before and during the rally. Issues notifications.
- Competitors' Relations Officer (CRO): First point of contact for competitor queries. Must be easily identifiable.
- FMU Safety Delegate: Can delay a stage start by up to 30 minutes for safety concerns.
- FMU Technical Delegate: Chief scrutineer for all technical matters.

ADMINISTRATIVE CHECKS (Art. 30)
- Competitors must report at the time published in the Supplementary Regulations.
- Fine for lateness: UGX 50,000 (Art. 30.1)
- Documents required: Competition licences, valid driving licences, passports/ID, ASN authorisation (foreign), completed entry form, car registration papers, proof of ownership.

SCRUTINEERING (Art. 31)
- Cars failing scrutineering must be made to comply and re-scrutineered.
- If still non-compliant, Stewards may refuse the car to start.
- Clothing including helmets must be presented at scrutineering (Art. 31.1.2).
- FMU Technical Passport is mandatory for all cars (Art. 12.2).

ENTRY CHANGES (Art. 22.4)
- Change of competitor permitted until close of entries.
- One crew member may be replaced: before admin checks with organiser's agreement; after admin checks start but before start list publication with Stewards' agreement.
- Replacement of both crew members after close of entries: Only FMU may authorise.

CHAMPIONSHIP POINTS (Art. 3.1)
- Full points if ≥75% of scheduled special stage distance run.
- Half points if ≥50% but <75% run.
- One-third points if ≥25% but <50% run.
- No points if <25% run.
- Driver must drive on Special Stages to score points (Art. 3.1.3).

RECONNAISSANCE (Art. 35)
- Reconnaissance is NOT practice. All road traffic laws apply (Art. 34.2.1).
- Each crew limited to TWO passages per special stage (Art. 35.4.3).
- Reconnaissance car must carry a tracking system (Art. 35.4.4).
- Driving on any rally stage road after SR publication requires organiser's written permission (Art. 35.3).

SPEEDING DURING RECONNAISSANCE (Art. 34.2.2)
- 1st offence: UGX 100,000 fine (by Clerk of Course)
- 2nd offence: UGX 200,000 fine (by Clerk of Course)
- 3rd offence: UGX 400,000 fine (by Clerk of Course)
These do not prevent Stewards from imposing heavier penalties (Art. 34.4).

SPEEDING DURING COMPETITION (Art. 34.3.4)
- 1st infringement: 1 minute per km/h over limit (Clerk of Course)
- 2nd infringement: 2 minutes per km/h over limit (Clerk of Course)
- 3rd infringement: 3 minutes per km/h over limit (Clerk of Course)
- 4th infringement: Disqualification (Stewards only)

SERVICE PARK SPEED (Art. 57.4)
- Maximum speed: 20 kph (or less as per SSRs)
- Penalty: UGX 100,000 per offence (by Clerk of Course)
- Any damage caused in service park: competitor held personally liable.

MAXIMUM LATENESS AT A START (Art. 40.2)
- Any crew more than 15 minutes late at a section start shall not be allowed to start that section.

TIME CONTROLS — CHECK-IN PROCEDURE (Art. 44)
- Timing recorded to the complete minute (Art. 44.1).
- No penalty if card handed in during target minute or the minute preceding it (Art. 44.2.8/44.2.9).
- Late arrival penalty: 10 seconds per minute (or fraction) late (Art. 44.2.10a).
- Early arrival penalty: 1 minute per minute (or fraction) early (Art. 44.2.10b).
- If check-in procedure not followed: marshal must send written report to CoC immediately (Art. 44.2.12).

MAXIMUM PERMITTED LATENESS (Art. 45)
- Individual target: exceeding 15 minutes = retirement at that control.
- Accumulative lateness between two overnight regroups: exceeding 30 minutes = retirement.
- Maximum penalty applied = that for 30 minutes late.
- Crew MAY restart under Art. 54.
- Notification of exceeding max lateness can only be announced at end of a section (Art. 45.3).

FALSE START (Art. 48.6)
- 1st offence: 10 seconds
- 2nd offence: 1 minute
- 3rd offence: 3 minutes
- Further offences: Stewards' discretion
Stewards may impose heavier penalties. Actual start time used for calculation.
Car not starting within 20 seconds of start signal = considered retired (Art. 48.4.3).

DELAYED START BY CREW FAULT (Art. 48.4)
- Penalty: 1 minute per minute (or fraction) late.
- Any crew refusing to start must be reported to Stewards (Art. 48.4.2).

STAGE INTERRUPTION / RED FLAGS (Art. 53.5)
- On seeing a Red Flag: immediately reduce speed, maintain reduced speed to end of stage, follow marshal instructions (Art. 53.5.3).
- Failure to comply: penalty at Stewards' discretion.
- Crew shown Red Flag: allocated a notional time for that stage (Art. 53.5.4).
- Electronic Red Flag: must acknowledge by pressing ACKNOWLEDGE button (Art. 53.5.1).

NOTIONAL TIME (Art. 52.3)
Allocated when: crew stops to rescue injured competitor; slowed by event vehicle; road is blocked; slowed by another crew.
Must request in writing to CoC with onboard camera evidence (Art. 52.4).

SOS/OK BOARD (Art. 53.2.2 / 53.3)
- Each car must carry SOS (red) / OK (green) board, minimum A3 size (42cm x 29.7cm).
- After accident with no urgent medical need: display OK sign immediately + red triangle 50m before car (Art. 53.3.3).
- After accident needing urgent medical attention: activate SOS on tracker + display SOS sign + red triangle 50m before car (Art. 53.3.1).
- If SOS displayed: ALL following cars must stop to render assistance (Art. 53.3.2).
- Failing to comply when able: reported by CoC to Stewards (Art. 53.3.6).
- Alternative signs: arms + thumb up = OK; crossed arms above head = SOS (Art. 53.3.5).

RETIRING (Art. 53.3.8)
- Any retiring crew must report retirement to organisers as soon as possible. Failure = penalty at Stewards' discretion.

RE-START AFTER RETIREMENT (Art. 54)
- May restart from start of next section (Art. 54.1.1).
- Must notify Clerk of Course in WRITING as soon as possible (Art. 54.1.1).
- Must hand in time card after retirement (Art. 54.1.2).
- If exceeding max lateness: may restart after next OVERNIGHT regroup only (Art. 54.1.3).
- Retired on last section of last day: WILL NOT BE CLASSIFIED (Art. 54.1.4).
- Deliberate retirement to gain advantage: Stewards may refuse restart (Art. 54.1.5).
- A crew can only restart ONCE during a leg (Art. 54.1.6).

RESTART PENALTIES (Art. 54.2)
- Missed super special stage: 5-minute penalty + fastest class time on that stage.
- Missed special stage: 10-minute penalty + fastest class time on that stage.

REPAIRS BEFORE RESTART (Art. 55)
- Car must report to overnight regroup no later than 1 hour before scheduled start of first vehicle (Art. 55.1).
- Must retain original body shell and engine block as marked at scrutineering (Art. 55.2).

ENGINE REPLACEMENT (Art. 16.1)
- Engine may be replaced in case of failure: 15-minute time penalty.
- Same engine block must be used from scrutineering to finish otherwise.

SERVICING (Art. 56)
- From first TC: service only in service parks (Art. 56.1.1).
- Crew may self-service using only on-board equipment (Art. 56.1.2).
- Team personnel prohibited within 1 km of competing car except in service parks, regroups, refuelling zones (Art. 56.2.1).

PARC FERMÉ (Art. 63)
- No work permitted unless specifically authorised.
- Crew must leave immediately after parking (Art. 63.2.1).
- Car covers not allowed (Art. 63.4).
- Safety item repair: permitted with Technical Delegate / scrutineer permission (Art. 63.5.1).
- Window change: only for safety with CoC consent + scrutineer supervision (Art. 63.5.2).
- Parc fermé repair delay: new start time given, penalty 1 min/min (Art. 63.5.3).

TRACKING / ROUTE DEVIATION (Art. 53.6)
- Live tracking mandatory (Art. 53.6).
- Liaison section: >10m deviation = 5-minute penalty by CoC (Art. 53.6.1).
- Competitive stage: missed tulip diagram = exclusion (unless crew corrects and returns to deviation point) (Art. 53.6.2a).
- Shortcut advantage: 10 minutes per incident (Art. 53.6.2b).
- Onus on crew to prove they followed the route (Art. 53.6.3).
- Post-event discovery: penalty may be added to next event entered (Art. 53.6.3).

FIRE EXTINGUISHER (Art. 7.2.5)
- Two 2kg hand-operated extinguishers mandatory.
- Must be active (no safety seal) during competition.
- Malfunctioning or defective: reported to Stewards, penalty up to exclusion.

TIME CARDS (Art. 19.3)
- Missing mark/signature OR failure to hand in time card at any control = crew considered retired at that control (Art. 19.3.3).
- Divergence between time card and official documents = inquiry by CoC (Art. 19.3.4).
- Only marshals may make entries on time card (Art. 19.3.2).

RESULTS (Art. 64)
- Unofficial → Partial Unofficial → Provisional → Final (approved by Stewards).
- Dead heat: best time on first non-SSS stage decides (Art. 64.3).

PROTESTS (Art. 65.1)
- Right to protest: COMPETITORS ONLY.
- Protesting multiple competitors: file SEPARATE protest for each.
- Must be IN WRITING + accompanied by deposit.
- Addressed to: Clerk of Course or assistant. If CoC absent: Jury or Stewards.

PROTEST DEPOSIT (Art. 65.2)
- UGX 250,000 — cash or Mobile Money.
- Mobile Money: must include proof of payment, otherwise protest inadmissible.
- Deposit returned ONLY if protest is upheld.

ADDITIONAL DEPOSIT FOR TECHNICAL PROTESTS (Art. 65.3)
- If protest requires dismantling: additional deposit set by Stewards.
- Costs borne by protester if unfounded; by protestee if upheld.

RIGHT OF REVIEW (Art. 65.3.3)
- Grounds: significant and relevant NEW element unavailable at time of original decision.
- Deadline: 96 hours from end of competition (Art. 65.3.3f). Max 24-hour extension by Stewards.
- Deposit: UGX 500,000. Half returned if review upheld (Art. 65.3.3h).
- FMU Sporting Commission / Deputy VP: exempt from deposit.
- Review has NO suspensive effect on original decision (Art. 65.3.3d).

APPEALS (Art. 65.4)
- Appeal Deposit: UGX 1,000,000.
- Stewards' decision immediately binding on: safety matters AND irregularity of entry.
- For all other matters: penalty SUSPENDED pending appeal. But competitor shown in penalised position in provisional results. Cannot appear at prize-giving in better position unless appeal is won.

PRIZE GIVING (Art. 66)
- Mandatory attendance for all competitors who completed the rally (Art. 66.4).
- Missing any part without prior written CoC permission: UGX 1,500,000 penalty imposed by FMU.
- Must appear in competition wear or sponsor attire (Art. 66.5).

FUEL / REFUELLING (Art. 61)
- May only refuel in designated Refuelling Areas or commercial filling stations.
- Speed limit in all RAs: 5 kph (Art. 61.2.2).
- Engine must be switched off throughout refuelling (Art. 61.2.6).
- Only 2 team members per crew may access RA (Art. 61.2.8).


═══════════════════════════════════════════
TYRES (Art. 13)
═══════════════════════════════════════════
- All tyres must be moulded. Hand cutting or modification of tread pattern is prohibited (Art. 13.1.2).
- Chemical/mechanical treatment of tyres is prohibited (Art. 13.1.3).
- Tarmac tyre tread depth must not be less than 1.6mm over at least 3/4 of the tread pattern at all times (Art. 13.1.9).
- Cars must carry minimum ONE and maximum TWO spare wheels (Art. 13.12).
- No complete wheel may be loaded/unloaded outside service parks or authorised tyre change areas (Art. 13.12).
- Tyre pressure adjustment permitted when: waiting time between TC and stage start >13 minutes, OR in regroups >10 minutes followed by a stage (Art. 13.10).
- Tyre controls may be carried out at any time. Non-conforming tyre marked and must not be used (Art. 13.7).

═══════════════════════════════════════════
CAR CLASSES (Art. 12)
═══════════════════════════════════════════
RC1: National Rally Cars 1.6T (WRC) and S2000 1.6T with 28mm restrictor.
RC2: S2000 2.0 Atmospheric, R5/R4/NR4, Group A over 1600cc-2000cc, Super 1600, R2/R3 variants.
RC3: R3 Turbo up to 1620cc, R3 Diesel up to 2000cc, Group A up to 1600cc.
RC4: R2 variants up to 1600cc, Kit-car up to 1600cc, Group N 1600-2000cc, Group N up to 1600cc.
RC5/NATIONAL: R1, 2WD non-homologated cars up to 2000cc, FIA R5 out of homologation, expired homologation cars.
S (CLASSIC): Pre-1985 models conforming to Appendix J Art. 253.
NATIONAL SUPER A: Group A regulations with 34mm restrictor.
SPV: Vehicle not in original form re: body and engine; 33mm turbo restrictor; all road legal vehicles allowed.
2WD Championship: Max 2000cc. Showroom 2WD with 1000cc turbo or naturally aspirated permitted (Art. 7.2.2).
FMU Technical Passport is mandatory for ALL cars (Art. 12.2). Class may be changed at scrutineering if car does not match entered class (Art. 25.1).

═══════════════════════════════════════════
TURBOCHARGERS & TRANSMISSIONS (Art. 16.2 / 16.3)
═══════════════════════════════════════════
TURBOCHARGERS: Turbocharger + one spare sealed at pre-rally scrutineering with same-numbered seals. All seals must remain intact to end of rally (Art. 16.2.5). Rally2 cars: FIA boost control pop-off valve sealed at scrutineering, must remain sealed unless FIA/FMU Technical Delegate approves otherwise (Art. 16.2.7).
TRANSMISSIONS: One spare gearbox + one set spare differentials permitted per rally. All sealed at initial scrutineering. Changes only in service park with scrutineers informed beforehand (Art. 16.3.6). Seals must remain intact from scrutineering to end of rally (Art. 16.3.8).

═══════════════════════════════════════════
ON-BOARD CAMERAS & TRACKING (Art. 18)
═══════════════════════════════════════════
- On-board camera must clearly show driver's eye view; alternate power source required (Art. 18.1.1). Highly recommended — it is primary evidence for disputes.
- All cars must be fitted with organiser-provided tracking system. Installation checked at scrutineering (Art. 18.2).
- Any interference with camera or tracking system = reported to Stewards (Art. 18.1.5 / 18.2).

═══════════════════════════════════════════
BULLETINS (Art. 2.2)
═══════════════════════════════════════════
- A Bulletin clarifies or completes the Supplementary Regulations. It CANNOT change or amend the Rally Sporting Regulations — only a waiver granted by FMU can do that (Art. 2.2).
- Before admin checks: issued by organisers with FMU approval.
- During competition: issued by Stewards. Itinerary changes issued by CoC (Stewards must be advised).
- Must be numbered, dated, displayed on yellow paper/background on official notice boards.
- Competitors must confirm receipt by signature (unless impossible during the rally).

═══════════════════════════════════════════
ENTRY PROCEDURES & FEES (Art. 22-24)
═══════════════════════════════════════════
- Entry form + full entry fee must be submitted before closing date (Art. 22.1).
- Car may be replaced freely up to scrutineering (Art. 22.2).
- Foreign competitors: must obtain International Competition Authorisation from FMU Sporting Commission at least 4 weeks before entry close (Art. 22.3).
- One crew member replacement: before admin checks = organiser consent; after admin checks start but before start list publication = Stewards consent (Art. 22.4).
- Replacing BOTH crew members after close of entries: FMU ONLY may authorise (Art. 22.4).
- Standard entry closing date: no later than 1 week before rally start (Art. 23.2).
- Full refund of entry fees: if entry not accepted OR rally does not take place (Art. 24.2).
- Partial refund: as per Supplementary Regulations (Art. 24.3).

═══════════════════════════════════════════
ADVERTISING (Art. 29)
═══════════════════════════════════════════
- Competitors may display any advertising provided it is: authorised by law, not offensive, not political/religious, does not obstruct vision (Art. 29.1).
- Mandatory organiser advertising is obligatory and cannot be refused by competitors (Art. 27.1.2).
- Optional organiser advertising refusal: competitor may be charged extra — max double entry fee, absolute maximum UGX 1,000,000 (Art. 29.4.1).
- No extra fee for optional advertising referring to a car make, tyres, fuel or lubricant if competitor justifies refusal to Stewards (Art. 29.4.2).

═══════════════════════════════════════════
PRIORITY DRIVERS (Art. 9)
═══════════════════════════════════════════
- P1: Former overall rally champions OR won an event OR won several stages in FMU NRC in one of last 3 years (Art. 9.1).
- P2: Won the DIV 1 Championship in the previous 3 years (Art. 9.1).
- P3: Won a Club Rally Championship in the previous 3 years (Art. 9.1).
- Numbers 1-12 reserved for FMU Premier (P1) drivers in order of previous season seeding (Art. 26.2).
- Stewards may REPOSITION a priority driver if their car does not justify their priority start position (Art. 9.2).
- Non-Scoring (NS) competitors: participate but NOT eligible for championship points (Art. 9.3).

═══════════════════════════════════════════
POWER STAGE (Art. 50)
═══════════════════════════════════════════
- Must be the LAST stage of the rally. Maximum 12km (Art. 50.1).
- Driver must be classified in Final Classification to score Power Stage points (Art. 50.3.1).
- Crew not starting in correct order: ineligible for Power Stage points and cannot detract points from others (Art. 50.3.1).
- Stage time + all time penalties including false start penalties = Power Stage classification time.
- If stage stopped before all eligible crews complete it: Stewards may decide no points awarded (Art. 50.3.2).

═══════════════════════════════════════════
TEAM CHAMPIONSHIP (Art. 7.3)
═══════════════════════════════════════════
- Team must comprise MORE than 2 crews. Must register + pay registration fee. Must appoint licensed Team Manager (Art. 7.3.1).
- Must field 3 nominated crews per round, including at least 1 x 2WD crew (Art. 7.3.1d/e).
- Only 2 BEST placed nominated crews score points. Third crew neither scores nor detracts points (Art. 7.3.1f).
- Title awarded to team with highest points from 8 NRC events. Minimum 3 registered teams per event required (Art. 7.3.2b/c).

═══════════════════════════════════════════
CRC — CLUBMAN RALLY CHAMPIONSHIP (Art. 7.4)
═══════════════════════════════════════════
- Reserved for competitors in their 2nd year of competition who met Autocross requirements in the preceding year.
- Must complete full year AND be classified finisher in at least 4 CRC events to be eligible for promotion to NRC (Art. 7.4.1).
- CRC driver NOT eligible to participate in foreign competitions (Art. 7.4.1).
- Failure to qualify for NRC: FMU CC may relegate to Autocross Championship (Art. 7.4.2).
- CRC classified as finisher after completing at least 60% of total competitive distance (Art. 7.4.3).
- CRC Co-drivers with Class C Licence: NOT eligible for NRC (Art. 7.4.4).
- Experienced co-driver (Class A) who becomes 1st Driver: must compete in CRC for that full season, cannot score NRC/2WD points that season (Art. 7.4.5/7.4.6).

═══════════════════════════════════════════
PODIUM CEREMONY (Appendix IV)
═══════════════════════════════════════════
- Ceremony within 2 hours of last car arriving in final service (App. IV Art. 1.1).
- Attendance MANDATORY for all competitors who completed the rally (Art. 66.4).
- Missing any part without written CoC permission: UGX 1,500,000 penalty imposed by FMU (Art. 66.4).
- Competitors MUST appear in competition wear or sponsors attire (Art. 66.5).
- Order: 10th to 1st on ramp → top 3 on Olympic podium → trophy presentations → anthem/flags/champagne.
- Maximum 6 persons may present prizes (App. IV Art. 1.8).
- Olympic-style podium mandatory for NRC events for overall top 3 (Art. 66.2).
- All awards may be presented while results are still provisional; must be returned if results change (Art. 66.3).

═══════════════════════════════════════════
MAXIMUM FINES BY AUTHORITY (Appendix R Art. 7)
═══════════════════════════════════════════
- Clerk of Course (non-FIA/FIM events): max UGX 250,000
- Stewards of the Meeting: max UGX 750,000
- FMU Competitions' Committee: max UGX 2,500,000
- FMU Disciplinary Court: max UGX 3,000,000
- FMU National Court of Appeal: max UGX 5,000,000
Fine payment: immediately upon notification, before next Stewards meeting. Delay = possible omission from results or suspension (Art. 2.3.1).

═══════════════════════════════════════════
FULL APPEAL FEES (Appendix R)
═══════════════════════════════════════════
- National/International championship — appeal to tribunal or FMU Appeal Court: UGX 2,000,000
- National/International championship — appeal to FMU Appeal Court against tribunal decision: UGX 2,000,000
- Below national championship — appeal to tribunal or FMU Appeal Court: UGX 250,000
- Below national championship — appeal against tribunal decision: UGX 325,000
- Right to Review: UGX 500,000 (half returned if upheld) (Art. 65.3.3h)
- Appeal to FMU National Court of Appeal (non-championship): UGX 1,000,000
- Appeal by individual to FMU Court of Appeal: UGX 250,000
- Appeal by individual to FMU National Court of Appeal: UGX 500,000
- Appeal by FMU licensed official: UGX 150,000
- Application for leave to appeal (where refused): UGX 250,000
Fees paid to lower courts NOT refunded if appeal succeeds at higher court (App. R Art. 9.4).
Administrative costs may be charged even if appeal succeeds — max 25% of appeal fee (App. R Art. 9.5).

═══════════════════════════════════════════
LICENCE FEES & CATEGORIES (Appendix R / Appendix T)
═══════════════════════════════════════════
LICENCE CATEGORIES (App. T):
- Class A: Premier Division/Division 1 drivers + ALL co-drivers.
- Class B: Division 2 drivers.
- Class C: CRC drivers, Autocross Cadet, co-drivers in their first year.
- Class D: Junior drivers under 18 years — Closed Circuit Autocross events ONLY.
- Class K: Karting Championship.

COMPETITION LICENCE FEES (App. R):
- International Competition Licence: USD 250
- National Class A (Premier/Div1 + all co-drivers): UGX 250,000
- National Class B (Division 2): UGX 200,000
- National Class C (CRC/Autocross/first-year co-drivers): UGX 150,000
- National Class D (Junior Closed Circuit): UGX 150,000
- Day Licence (Sprint/Autocross/Drifting/Karting): UGX 100,000
- Day Licence (Motorcycling): UGX 50,000
- Annual specially requested Competition Number: UGX 1,000,000
- Rally Team Registration: UGX 1,000,000
- Team Manager Licence: UGX 250,000
- 50% surcharge on all licence applications received after June 30th (App. R Art. 5).
- Licences valid for one calendar year, expire December 31st (App. T Art. 3).
- Duplicate licence (lost/stolen): 50% of original fee (App. R Art. 5.1).

OFFICIALS LICENCES FEES:
- Category A: UGX 100,000 | Category B: UGX 80,000 | Category C: UGX 60,000 | Category D: UGX 60,000

LICENCE VIOLATIONS:
- Competing without licence or wrong licence: UGX 1,000,000 + loss of all points accrued (App. R Art. 2.2.7).
- Organiser allowing unlicensed official to officiate: UGX 300,000 per official (App. R).
- Competing in unauthorised event: 1st offence = 3 months suspension; 2nd = 12 months; 3rd = Worldwide Life Ban (App. T Art. 11).

SUSPENSION EFFECTS (App. T Art. 5.3):
- National suspension: licence returned to FMU, marked Not valid for [duration] (Uganda). Delay in returning adds to suspension.
- International suspension: licence returned to FMU, not returned until suspension expires.
- Disqualification: PERMANENT. Can only be pronounced by FMU Executive. Always international — notified to all ASNs/FMNs.

MEDICAL (App. T Art. 6 / App. M):
- Annual medical aptitude examination required for all drivers (App. M Art. 1.2).
- Blood group + RH must be marked on driver's helmet and competing vehicle.
- Anti-doping/alcohol tests may be carried out at any time (App. T Art. 14).
- After accident causing incapacity of 10+ days: cannot compete again until FMU Competitions Committee authorises return (App. M Art. 3).
- Driver must notify FMU if any medical condition becomes evident during the licence period (App. T Art. 6).
- Incompatible with competing: epilepsy with behavioral effects; amputations (except fingers where gripping function preserved); limb movement impeded >50% (App. M Art. 1.4).

═══════════════════════════════════════════
ORGANISING PERMITS (Appendix XX)
═══════════════════════════════════════════
- Only FMU or FMU-affiliated clubs with FMU approval may organise competitions (App. XX Art. 2a).
- Permit application at least 8 weeks before event. Must include draft SR, road book, safety plan (App. XX Art. 9).
- Must first obtain permission from property owners, Police, Local and Government authorities (App. XX Art. 1).
- No club may launch any event before FMU Certificate of No Objection is issued.
- Unauthorised competition: all persons involved liable to penalties. All entry fees must be returned (App. XX Art. 8).
- Late application: permit fee doubled (App. R Art. 2.2.1).
- Date change on FMU calendar: penalty = 20% of prescribed organising fee (App. R Art. 2.2.2).
- Late submission of results: UGX 10,000 per day late (App. R Art. 2.2.3).
- Failing to display FMU logos: up to UGX 150,000 penalty (App. R Art. 2.2.6).

═══════════════════════════════════════════
CRO — COMPETITORS RELATIONS OFFICER (Art. 11.3)
═══════════════════════════════════════════
- At least one CRO must be at each event; must be easily identifiable (conspicuous badge/tabard).
- Must be introduced to competitors at drivers briefing; photograph must appear in Supplementary Regulations.
- Must hold FMU licence qualified to act as Clerk of Course or FMU Observer.
- Attends ALL Stewards meetings to stay current on all decisions.
- The CRO must NOT say anything that might give rise to protests; they mediate before escalating to Stewards.
- APPROACH THE CRO FIRST for any regulatory query before filing a formal protest.

═══════════════════════════════════════════
2026 FMU SEASONALLY ALLOCATED COMPETITOR NUMBERS (Art. 26)
═══════════════════════════════════════════
Use this list to instantly answer questions about competitor car numbers or who drives a given number.
Numbers 1-12 reserved for FMU Premier drivers. Number 77 RETIRED in memory of Bike 77.

#1-Ronald SEBUGUZI | #3-Duncan Mubiru | #4-Ponsiano Lwakataka | #5-Peter KALULE | #6-Aine Kaguta 'Sodo' | #7-Mansoor LUBEGA | #8-Amir KAVUMA | #9-Haruna KATAZA | #10-Mike MUKULA Jr | #11-Julius SEMAMBO | #12-Didas MASIKO | #14-Musa Segabwe | #15-Samuel BWEETE | #16-Faizal KAYIRA | #17-Yassin Nasser | #18-Umar DAUDA | #19-Ibrahim LUBEGA | #20-Hassan Alwi | #21-Nasser MUTEBI | #22-Joshua MUWANGUZI | #23-Edward KIRUMIRA | #24-Isaac SSOZI | #25-Oscar NTAMBI | #26-Odeon TUMWEBAZE | #27-Samuel WATENDWA | #28-WO1 Ismail LULE | #29-Sadat NEGOMBA | #30-Ahmed SENYONJO | #31-Ali OMAR 'Bobo' | #32-Susan MUWONGE | #33-Fred BUSULWA | #35-John CONSTA | #36-Francis OMO | #37-Dr. Henry MASERUKA | #38-Dr. Godfrey NSEREKO | #39-Yassin MUKASA | #40-Nasser RATIB | #41-Jamada LWABAGA | #42-Timothy GAWAYA | #43-Moustapha MUKASA | #44-Walter Kibande | #45-Ahmed Kateete jr | #46-Kevin Bebeto | #47-Shid MAKUMBI | #48-Jas MANGAT | #49-Abaasi MAYINJA | #50-Byron RUGOMOKA | #51-Amir KAWEESA | #52-Issa NYANZI | #53-Omar MAYANJA | #54-Andrew MUSOKE | #55-Gilberto BALONDEMU | #56-Godfrey KIYIMBA | #57-Patrick SEBAMBULIDDE | #58-Ali MOHAMMED | #59-Patrick RUYONGA | #60-Humphrey KAWUKI | #61-Ian Hanz BACHU | #62-Sande MUBIRU | #63-Geofrey MUNYEGERA | #64-Samuel SEKANDI | #65-Nasib SESSANGA | #66-Topher KATEERA | #67-Chris Bahizi | #68-Robert K. SENTONGO | #69-Doreen ASIIMWE | #70-John P. KYEBAMBE | #71-Ukasha Mugoya | #72-Sharif MUYANJA | #73-Najib Ssempijja | #74-Japhethi Lugayizi | #75-Salim GASEMBA | #76-Abaasi SEBUNYA | #77-RETIRED (memory of Bike 77) | #78-Muzamir Watolya | #79-Fred SENKUMBA | #80-Muzamir Watolya | #81-Fred SENKUMBA | #82-Yusuf BUKENYA | #83-Frank TATYA | #84-Edson Mungyereza | #85-Kuku RANJIT | #86-Wyclif Bukenya | #87-Shafic SSENDAGIRE | #89-Paul KASOZI | #90-Muyanja Sabiti | #91-Umar Kakyama | #92-Innocent Bwamiki | #93-John Burrows | #94-Vicent Muwanguzi | #95-Abdul Kateete | #96-Ahmed Mayinja | #97-Salim KYEBAGADA | #98-Mansoor SSANYA | #99-Arthur Blick | #100-Jonas KANSIIME | #101-Sempera Kakule | #102-Fred Wampamba | #103-Happy K. Richard | #104-Farouk Ssentongo | #105-Unissan Bakunda

═══════════════════════════════════════════
RESPONSE FORMAT
═══════════════════════════════════════════
Always structure your answer with these clear sections when applicable:
1. 🚨 IMMEDIATE ACTION — What to do RIGHT NOW
2. 📋 YOUR RIGHTS — What the rules say you're entitled to
3. ⚠️ DEADLINES — Any time limits to be aware of
4. 💰 COSTS — Any deposits or fees involved
5. 📌 WHO TO CONTACT — The correct official to approach
6. 💡 TEAM ADVICE — Practical tip for Walts Rally Team
7. 📖 RULES REFERENCED — Clean list of all articles cited

CRITICAL: Cite the specific NCR Article inline with every piece of guidance using:
📖 NCR Art. [X.X] — "[brief paraphrase of the rule]"

Keep answers sharp and actionable. This is race day — no fluff.`;

const QUICK_SCENARIOS = [
  { icon: "🚦", label: "False Start", prompt: "We just received a false start penalty on a stage. What are our options?" },
  { icon: "🔍", label: "Rival Cheating", prompt: "We suspect a rival car is running illegal modifications. How do we protest?" },
  { icon: "🃏", label: "Wrong Time on Card", prompt: "The marshal put the wrong time on our time card at a control. What do we do?" },
  { icon: "🔧", label: "Want to Restart", prompt: "Our car broke down and we had to retire. Can we restart and what penalties apply?" },
  { icon: "🗺️", label: "Route Deviation", prompt: "We were given a route deviation penalty but we think it was unfair. How do we challenge it?" },
  { icon: "⏰", label: "Late to Admin", prompt: "We arrived late to administrative checks. What is the fine and what do we do?" },
  { icon: "🚩", label: "Red Flag on Stage", prompt: "We saw a red flag mid-stage. What exactly must we do now?" },
  { icon: "💨", label: "Speeding Fine", prompt: "We got a speeding fine during reconnaissance. What are the exact amounts and can we appeal?" },
  { icon: "🏎️", label: "Engine Failure", prompt: "Our engine has failed during the rally. Can we replace it and what is the penalty?" },
  { icon: "🅿️", label: "Parc Fermé Work", prompt: "We need to do some work on the car while it is in parc fermé. What is allowed?" },
  { icon: "🆘", label: "SOS/OK Board", prompt: "We had an incident on stage. When exactly do we show SOS vs OK and what do we do?" },
  { icon: "⚖️", label: "Appeal a Decision", prompt: "The Stewards made a decision against us. How do we appeal and what does it cost?" },
];

export default function WaltsRallyAdvisor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setShowIntro(false);
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1500,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...newMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "No response received.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Connection error. Please try again." }]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessage = (msg, idx) => {
    const isUser = msg.role === "user";
    return (
      <div key={idx} style={{
        display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 16, alignItems: "flex-end", gap: 8,
      }}>
        {!isUser && (
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg, #C0392B, #922B21)",
            flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800, color: "#fff", boxShadow: "0 2px 8px rgba(192,57,43,0.35)",
          }}>W</div>
        )}
        <div style={{
          maxWidth: "78%", padding: "12px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser ? "linear-gradient(135deg, #C0392B, #922B21)" : "#ffffff",
          color: isUser ? "#fff" : "#1a1a1a",
          boxShadow: isUser ? "0 4px 15px rgba(192,57,43,0.3)" : "0 2px 12px rgba(0,0,0,0.08)",
          fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap",
          border: isUser ? "none" : "1px solid #eee",
        }}>
          {msg.content}
        </div>
        {isUser && (
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: "#e8e8e8",
            flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#888",
          }}>YOU</div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      height: "100dvh", background: "#f5f5f5", display: "flex", flexDirection: "column",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #C0392B 0%, #7B241C 100%)",
        padding: "14px 18px", flexShrink: 0,
        boxShadow: "0 4px 20px rgba(192,57,43,0.4)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            border: "1px solid rgba(255,255,255,0.2)",
          }}>🏁</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontSize: 17, fontWeight: 800, letterSpacing: "0.02em" }}>
              WALTS RALLY TEAM
            </div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 1 }}>
              FMU 2026 Rules Advisor · Full NCR Coverage
            </div>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.15)", borderRadius: 20,
            padding: "4px 10px", display: "flex", alignItems: "center", gap: 5,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
            <span style={{ color: "#fff", fontSize: 10, fontWeight: 600 }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0" }}>
        {showIntro && (
          <div style={{ paddingBottom: 8 }}>
            <div style={{
              background: "linear-gradient(135deg, #C0392B 0%, #7B241C 100%)",
              borderRadius: 20, padding: "24px 20px", marginBottom: 16, textAlign: "center",
              boxShadow: "0 8px 30px rgba(192,57,43,0.3)",
            }}>
              <div style={{ fontSize: 44, marginBottom: 8 }}>🏎️</div>
              <div style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Race Day Advisor</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.6 }}>
                Instant FMU 2026 rules guidance with exact article citations for every answer
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>
                Common Situations
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {QUICK_SCENARIOS.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s.prompt)} style={{
                    background: "#fff", border: "1.5px solid #eee", borderRadius: 14,
                    padding: "12px 10px", cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#C0392B"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(192,57,43,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}>{s.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => renderMessage(msg, idx))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 16 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, #C0392B, #922B21)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 800, color: "#fff",
            }}>W</div>
            <div style={{
              background: "#fff", border: "1px solid #eee", borderRadius: "18px 18px 18px 4px",
              padding: "14px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              display: "flex", gap: 5, alignItems: "center",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%", background: "#C0392B",
                  animation: "bounce 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.18}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} style={{ height: 16 }} />
      </div>

      {/* Input Bar */}
      <div style={{
        background: "#fff", borderTop: "1px solid #eee", padding: "10px 12px 14px",
        flexShrink: 0, boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
      }}>
        {!showIntro && (
          <div style={{ display: "flex", gap: 6, marginBottom: 8, overflowX: "auto", paddingBottom: 2 }}>
            {QUICK_SCENARIOS.slice(0, 6).map((s, i) => (
              <button key={i} onClick={() => sendMessage(s.prompt)} style={{
                background: "#f8f8f8", border: "1.5px solid #eee", color: "#555",
                padding: "5px 11px", borderRadius: 20, cursor: "pointer", fontSize: 11,
                fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#C0392B"; e.currentTarget.style.color = "#C0392B"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.color = "#555"; }}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Describe your situation..."
            disabled={loading}
            rows={1}
            style={{
              flex: 1, background: "#f5f5f5", border: "1.5px solid #e8e8e8",
              color: "#1a1a1a", borderRadius: 22, padding: "11px 16px",
              fontSize: 14, resize: "none", outline: "none", lineHeight: 1.5,
              transition: "border-color 0.15s", maxHeight: 100, overflowY: "auto",
              fontFamily: "inherit",
            }}
            onFocus={e => e.target.style.borderColor = "#C0392B"}
            onBlur={e => e.target.style.borderColor = "#e8e8e8"}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              background: input.trim() && !loading ? "linear-gradient(135deg, #C0392B, #922B21)" : "#e8e8e8",
              border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, transition: "all 0.2s",
              boxShadow: input.trim() && !loading ? "0 4px 15px rgba(192,57,43,0.4)" : "none",
              color: input.trim() && !loading ? "#fff" : "#aaa",
            }}
          >▶</button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        textarea { scrollbar-width: none; }
      `}</style>
    </div>
  );
}
