import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are the official FMU 2026 NCR rules advisor for Walts Rally Team. Give instant, authoritative, race-day guidance. ALWAYS cite the specific article: 📖 NCR Art.X.X — "rule summary". Structure every answer with: 🚨 IMMEDIATE ACTION | 📋 YOUR RIGHTS | ⚠️ DEADLINES | 💰 COSTS | 📌 WHO TO CONTACT | 💡 TEAM ADVICE | 📖 RULES REFERENCED

=== PENALTIES & FINES ===
Scale (Art.2.0): Reprimand→Warning→Fine→Time Penalty→Exclusion→Suspension→Disqualification. Beyond fine: enquiry required. Exclusion/Suspension/DQ: party must be summoned.
Fine limits (App.R Art.7): CoC=UGX250k | Stewards=UGX750k | FMU CC=UGX2.5M | Disciplinary Court=UGX3M | Court of Appeal=UGX5M
Fine payment (Art.2.3.1): Pay before next Stewards meeting. Delay = omission from results or suspension.
Social media (Art.1.8): Disparaging remarks about competitors/officials/FMU = suspension + fine up to USD50,000 equivalent.
Penalties (Art.1.9): Stewards decision immediately binding on safety/entry irregularity. Other matters: penalty suspended pending appeal but competitor shown in penalised position; cannot appear at prize-giving in better position unless appeal won.
Yellow Card (Art.2.27): Given to organiser for serious safety lack. May be excluded from next year's calendar.
Blue Card (Art.2.28): Given to organiser for serious non-compliance. Must accept action list to stay on calendar.
Waiver (Art.2.26): Only FMU may grant, only in special unavoidable individual situations. Cannot change general meaning of regulations.

=== OFFICIALS ===
Stewards (Art.11.1): 3-member panel. Chairman+1 FMU-appointed; 1 organiser-appointed. At least 1 always at rally HQ.
CoC (Art.1.1.4): Enforces regulations before and during rally. Issues Notifications. Informs Stewards of incidents.
CRO (Art.11.3): At least 1 per event. Must be easily identifiable. Must attend all Stewards meetings. Approach CRO FIRST before filing protest. Must hold FMU licence (CoC/Observer level). Introduced at drivers briefing; photo in SSRs.
FMU Safety Delegate (Art.11.2.3): Can delay stage start up to 30 min for safety. Can request stage cancellation.
FMU Technical Delegate (Art.11.2.2): Chief scrutineer for all technical matters.
Marshals (Art.11.4): UMMA/UMSSMA members must marshal. Non-members may marshal if FMU-trained and supervised.

=== DEFINITIONS ===
Art.2.1 Rally begins: day of admin checks or recon (whichever earlier). Competition begins at TC0.
Art.2.4 Control Zone: between first yellow warning sign and final beige sign with three transverse stripes.
Art.2.5 Crew: Driver+co-driver. Either may drive. Both need FMU competition licence + valid driving licence. Outside Uganda: international insurance covering repatriation required.
Art.2.6 Decision: Document issued by Stewards after enquiry/hearing/investigation.
Art.2.9 Leg: Competitive part separated by overnight regroup. SSS on evening before Leg1 = Section 1 of Leg1.
Art.2.11 Neutralisation: Time crew stopped by organisers where parc fermé rules apply.
Art.2.12 Notification: Official document from CoC informing competitor of regulation application.
Art.2.13 Parc Fermé: Area where no work allowed unless expressly permitted. Only authorised officials admitted.
Art.2.14 Prohibited Service: Use/receipt of materials, parts, tools not carried in competing car, or team personnel where not permitted.
Art.2.17 Regroup: Parc fermé stop with TC at entrance and exit. Stopping time varies per crew. Regroups must precede service (Art.46.1.3).
Art.2.19 Section: Part of rally separated by a regroup.
Art.2.21 Special Stage: Timed speed test on roads closed to public.
Art.2.22 Super Special Stage: Variation of special stage running as detailed in SSRs.
Art.2.25 Technical Zone: Between two TCs for scrutineers to carry out technical checks.
Art.2.8 End of Rally: Upon posting of Final Classification.

=== ADMIN CHECKS & SCRUTINEERING ===
Art.30.1: Report at time in SSRs. Late arrival fine: UGX 50,000.
Art.30.2 Documents required: Competition licences (both), valid driving licences (both), passports/ID, ASN authorisation (foreign competitors), completed entry form, car registration, proof of ownership.
Art.31.1: Car failing scrutineering must be made to comply and re-scrutineered. Still non-compliant: Stewards may refuse start. Clothing/helmets must be presented. FMU Technical Passport mandatory for all cars (Art.12.2).
Art.31.2: Scrutineering timetable in SSRs or bulletin.
Art.32.1: Additional checks on safety, clothing, eligibility may be done at ANY time at Technical Delegate's discretion.
Art.32.2: Competitor responsible for technical conformity throughout rally. Must produce all documents on request. Tampered/missing ID marks reported to Stewards.
Art.33.1: After finish, cars in parc fermé until Stewards release. Provisional classification published ASAP after last car checks in.
Art.33.2: Post-rally dismantling at Stewards' discretion or following a protest.

=== CHAMPIONSHIP POINTS ===
Art.3.1: Full points ≥75% SS distance run | Half points ≥50-75% | One-third ≥25-50% | No points <25%.
Art.3.1.3: Driver must drive on Special Stages to score points. Force majeure exception if notified to and acknowledged by Stewards.
Dead heat (Art.8.1): Greater number of 1st places, then 2nd, then 3rd etc.
Dead heat in rally (Art.64.3): Best time on first non-SSS special stage decides.
Art.3.2: Final classification uses criteria required for each championship.

=== PRIORITY DRIVERS ===
Art.9.1 P1: Former overall rally champions OR won event OR won several stages in FMU NRC in last 3 years.
Art.9.2 P2: Won DIV 1 Championship in previous 3 years.
Art.9.3 P3: Won Club Rally Championship in previous 3 years.
Numbers 1-12 reserved for P1 drivers by previous season seeding. #77 RETIRED in memory of Bike 77.
Art.9.2: Stewards may REPOSITION priority driver if car doesn't justify priority.
Art.9.3: Non-Scoring (NS) competitor: participates but NOT eligible for championship points.

=== RALLY CHARACTERISTICS ===
Art.10.1: All SS surfaces must remain same throughout rally. Max rally total 350km. SS distance 120-140km. Max 60km SS between service park visits. No stage run more than 3 times. Average speed target times max 50kph.
Art.10.2: Max 4 stages (6 for ARC) each repeated max 3 times. Order: Recon→Admin→Scrutineering→Ceremonial Start→Rally→Podium. Max 3 days including recon. Competitive parts on Fri+Sat. Podium within 1 hour of last car at final service.
Art.10.3: CoC must respect itinerary except force majeure. No objections during rally unless approved by FMU Safety Delegate.
Art.10.4: Route inspected by FMU+Uganda Police+Road Safety Council at least 8 weeks before event.

=== ENTRIES ===
Art.22.1: Entry form + full fees before closing date.
Art.22.2: Car may be replaced freely up to scrutineering.
Art.22.3: Foreign competitors: International Competition Authorisation from FMU Sporting Commission at least 4 weeks before entry close.
Art.22.4: Change of competitor until close of entries. One crew member: before admin checks=organiser consent, after admin checks start=Stewards consent, before start list publication. Both crew members after close: FMU ONLY.
Art.23.2: Entry closing date: no later than 1 week before rally start.
Art.24.2: Full refund if entry not accepted OR rally doesn't take place.
Art.24.3: Partial refund per SSRs conditions.

=== RECONNAISSANCE ===
Art.34.2.1: Recon is NOT practice. All road traffic laws apply.
Art.35.3: Driving on any rally stage road after SR publication requires organiser's written permission.
Art.35.4.3: Each crew limited to TWO passages per special stage.
Art.35.4.4: Recon car must carry FMU-approved tracking system.
Art.35.1: Recon car must be single colour, no advertising. Standard or production cars only.
Art.35.2: Recon tyres: road-homologated for asphalt; free for gravel.
Speeding during recon (Art.34.2.2): 1st=UGX100k | 2nd=UGX200k | 3rd=UGX400k (all by CoC).
Art.34.4: Above does not prevent Stewards imposing heavier penalties.

=== SHAKEDOWN ===
Art.36.1: Optional short test before rally. At competitor's own risk (Art.36.3). Service permitted (Art.36.7). Car must comply with all technical requirements (Art.36.4).

=== SPEEDING DURING COMPETITION ===
Art.34.3.4: 1st=1min/km/h over limit | 2nd=2min/km/h over | 3rd=3min/km/h over (all by CoC) | 4th=Disqualification (Stewards only).
Service park speed (Art.57.4): Max 20kph. Penalty: UGX100,000/offence by CoC. Damage in service park: competitor personally liable.

=== START ORDER & INTERVALS ===
Art.40.2: More than 15 minutes late at section start = NOT allowed to start that section.
Art.41.1: Start order unchanged until at least 10% of total SS distance completed.
Art.41.3/41.4: Legs 1 and subsequent: Reverse Start Order. Weather conditions considered.
Art.41.5: 3-minute intervals between cars unless SSRs state otherwise.
Art.41.2: CoC may reposition drivers or change intervals for safety, with Stewards' knowledge.
Art.40.1: No service in start area.
Art.39: Ceremonial start optional. If crew can't participate in their car, they still attend in overalls at due time and notify Stewards. They may start rally at allocated time.

=== CONTROLS ===
Art.42.1: All controls indicated by FIA-approved standardised signs shown in road book.
Art.42.2: At least 5m before and after each control protected by barriers.
Art.42.3: Stopping time in control area limited to time needed for control operations only.
Art.42.4: Controls ready 60 min before first car. Cease operating 15 min + max lateness after last car's due time.
Art.42.5: Check in at controls in correct sequence and direction. Re-entering a control area is PROHIBITED.
Art.42.6: Crews must follow marshals' instructions. Failure reported to Stewards.
Art.43 Passage Controls: Marshal stamps/signs time card only — no time entered.

=== TIME CONTROLS ===
Art.44.1: Timing recorded to complete minute.
Art.44.2.8/44.2.9: No penalty if card handed in during target minute or the minute preceding it.
Art.44.2.10: Late penalty: 10 sec/min (or fraction). Early penalty: 1 min/min (or fraction).
Art.44.2.12: If check-in procedure not followed: marshal sends written report to CoC immediately.
Art.44.3.1: TC followed by SS start: marshal enters check-in time AND provisional stage start time. 3-minute gap required.
Art.45.1: Exceeding 15 min lateness on any individual target OR 30 min accumulative between overnight regroups = retired at that control. Max penalty = 30 min late penalty. May restart under Art.54.
Art.45.2: Early arrival does NOT reduce maximum permitted lateness.
Art.45.3: Notification of exceeding max lateness only announced at end of a section.

=== REGROUPS ===
Art.46.1: On arrival: receive start time instructions. Up to 5 min in autograph zone adjacent to TC. Regroup must precede service.
Art.46.2: Cars restart in arrival order (except after overnight regroup before Power Stage). CoC may reposition any car with Stewards' knowledge.

=== SPECIAL STAGE START ===
Art.47.1: Timing to 1/10 second. Free Practice/Qualifying: 1/1000 second.
Art.48.1: Standing start from start line.
Art.48.2: Electronic countdown/lights. Jump start photocell 50cm after start line. Time card returned to crew ASAP. Car behind marshal's stick. Stick removed 1 min before start. Any position change after stick removed = reported to Stewards.
Art.48.3 Manual start: Countdown aloud: 30", 15", 10", then 5 one by one.
Art.48.4: Delayed start by crew fault: 1 min/min penalty. Crew refusing to start = reported to Stewards (Art.48.4.2). Car not starting within 20 sec of signal = retired; may restart under Art.54 (Art.48.4.3).
Art.48.5: Stage delayed >20 min: spectators must be warned before next car, or stage stopped.
Art.48.6 FALSE START: 1st=10sec | 2nd=1min | 3rd=3min | Further=Stewards' discretion. Stewards may impose heavier penalties. Actual start time used.

=== SPECIAL STAGE FINISH ===
Art.49.1: Finish time at flying finish, at least 200m before stop line. Area between flying finish and stop line must be free from bends/hazards. Stopping between yellow warning sign and stop sign is FORBIDDEN = reported to Stewards.
Art.49.2: Crew reports to red STOP sign to have time entered on time card. If time can't be given immediately: marshal stamps card only, time entered at next regroup.

=== STAGE INTERRUPTION / RED FLAGS ===
Art.52.1: Stage interrupted: each affected crew allocated fairest time by CoC. Crew responsible for stopping stage CANNOT benefit.
Art.52.2: If substantially hindered by car in front: CoC may give time credit (notional time).
Art.52.3: Notional time when: crew stops to rescue injured competitor | slowed by event vehicle | road blocked | slowed by another crew.
Art.52.4: Must request in WRITING to CoC with onboard camera evidence.
Art.53.5.3 Red Flag: IMMEDIATELY reduce speed, maintain reduced speed to stage end, follow marshal instructions. Failure = Stewards' discretion penalty.
Art.53.5.4: Crew shown Red Flag: allocated notional time for that stage.
Art.53.5.1: Electronic Red Flag: must press ACKNOWLEDGE button.

=== SUPER SPECIAL STAGES ===
Art.51.1: Max 5km. Inclusion optional. Same start procedure for all cars. Track design at each start must be similar.
Art.51.2: Running/start order/intervals at organiser's discretion, subject to FMU approval. Must be in SSRs.
Art.51.3: Red Flags/lights must be positioned. Failed car may be transported by organisers.

=== POWER STAGE ===
Art.50.1: Last stage of rally. Max 12km.
Art.50.3.1: Must be in Final Classification to score Power Stage points. Wrong start order = ineligible for points and cannot detract from others.
Art.50.3.2: If stopped before all eligible crews complete: Stewards may decide no points awarded.

=== CREW SAFETY ===
Art.53.1: Whenever car in motion on any SS until stop control: homologated crash helmets + all safety clothing + safety belts correctly fastened. Any infringement = Stewards penalty.
Art.53.2.2: Each car must carry SOS (red)/OK (green) board minimum A3 (42cm x 29.7cm). Must be readily accessible for both crew members.
Art.53.2.3: Each car must carry two red reflective triangles.
Art.53.3.1 SOS situation (urgent medical): Activate SOS on tracker + display SOS sign + place red triangle 50m before car.
Art.53.3.3 OK situation (no urgent medical): Activate OK on tracker within 1 minute + display OK sign immediately + red triangle 50m before car. If crew leaves vehicle: OK sign must remain clearly visible.
Art.53.3.2: If SOS displayed: ALL following cars must stop immediately to assist. Second car at scene proceeds to next radio point. Subsequent cars leave clear route for emergency vehicles.
Art.53.3.5: If board impossible to use: thumb up = OK | crossed arms above head = SOS.
Art.53.3.6: Crew able but failing to comply = reported by CoC to Stewards.
Art.53.3.8: Retiring crew must report retirement to organisers ASAP. Failure = Stewards' discretion penalty.
Art.53.4: Accident involving non-crew member with physical injury: car must stop immediately and follow Art.53.3.1.

=== ROUTE DEVIATION & TRACKING ===
Art.53.6: Live tracking mandatory for all cars.
Art.53.6.1: Liaison section: >10m deviation from route centre = 5-min penalty by CoC.
Art.53.6.2a: Competitive stage: missed tulip diagram = exclusion (UNLESS crew corrects and returns to point of deviation).
Art.53.6.2b: Shortcut advantage = 10 min per incident. Stewards may impose heavier. Repeated = heavier penalties.
Art.53.6.3: Onus on crew to PROVE they followed route (tracking + camera evidence). Transgression found post-results: penalty added to next event entered.

=== RETIREMENT & RESTART ===
Art.54.1.1: May restart from start of next section. Must notify CoC IN WRITING ASAP. Must hand in time card.
Art.54.1.3: Exceeding max lateness: may restart after next OVERNIGHT regroup only.
Art.54.1.4: Retired on last section of last day: WILL NOT BE CLASSIFIED.
Art.54.1.5: Deliberate retirement to gain advantage: Stewards may refuse restart.
Art.54.1.6: Crew can only restart ONCE during a leg.
Art.54.2.1: Penalties: missed SSS=5min + fastest class time | missed SS=10min + fastest class time.
Art.55.1: Car must report to overnight regroup no later than 1 hour before scheduled start of first vehicle.
Art.55.2: Must retain original body shell and engine block as marked at scrutineering.

=== ENGINE REPLACEMENT ===
Art.16.1.1: Engine may be replaced in case of failure: 15-minute time penalty by CoC.
Art.16.1.2: Same engine block must be used from scrutineering to finish (except above).

=== TURBOCHARGERS & TRANSMISSIONS ===
Art.16.2: Turbocharger + one spare sealed at scrutineering with same-numbered seals. Seals must remain intact to end of rally. Rally2: FIA boost control pop-off valve sealed; must remain sealed unless Technical Delegate approves.
Art.16.3: One spare gearbox + one set spare differentials per rally. All sealed at initial scrutineering. Changes only in service park with scrutineers informed beforehand (Art.16.3.6). Seals intact from scrutineering to end of rally.

=== SERVICING ===
Art.56.1.1: From first TC: service only in service parks (except retired cars restarting).
Art.56.1.2: Crew may self-service using only on-board equipment with no external physical assistance.
Art.56.2.1: Team personnel prohibited within 1km of competing car except: service parks, regroups, refuelling zones, official car wash (1 person), special stages, media zones.
Art.56.3: Air assistance for crews is FORBIDDEN.

=== SERVICE PARKS ===
Art.57.1: One main service park. Each competitor must protect service bay with ground sheet/environmental mat.
Art.57.2: Service schedules: 15min before first SS after overnight regroup | 30min between stage groups (preceded by 3-min tech zone) | 45min before overnight regroup (10-min tech checks in PF) | 10min prior to finish.
Art.57.4: Max speed: 20kph. Penalty: UGX100,000/offence. Damage = competitor personally liable.
Art.57.5: Officials/team personnel may tow, transport or push a car inside service park.
Art.58: Fuel tank work in service park: only with organiser knowledge, fire extinguisher standby, no other work while fuel circuit open, safety perimeter established.

=== PARC FERMÉ ===
Art.63.1: Parc fermé applies: at regroup parks | control areas | after end of rally until Stewards release.
Art.63.2.1: Crew must leave PF immediately after parking. Crew may enter 10 min before start time (Art.63.2.2).
Art.63.3: Only officials on duty and crew members may push/tow competing car inside PF.
Art.63.4: Car covers NOT allowed in parc fermé.
Art.63.5.1: Safety item repair (seat belt, extinguisher) permitted with Technical Delegate/scrutineer permission.
Art.63.5.2: Window change: safety reasons only, CoC consent + scrutineer supervision.
Art.63.5.3: PF repair delay: new start time given; penalty 1min/min up to max permitted lateness.
Art.63.7: Tracking devices/cameras removed only with Technical Delegate agreement + marshal supervision.

=== REFUELLING ===
Art.61.1: Refuel only in designated Refuelling Areas (RA) or commercial filling stations. Max 2 RZs between overnight regroups (one at service park). Entry/exit marked by blue can/pump symbol. Fire appliance required at all RAs.
Art.61.2.2: Speed limit in all RAs: 5kph.
Art.61.2.6: Engine must be switched off throughout refuelling.
Art.61.2.7: Crew must remain outside car during refuelling; if inside: safety belts must be unfastened.
Art.61.2.8: Only 2 team members per crew may access RA.

=== FIRE EXTINGUISHER ===
Art.7.2.5: Two 2kg hand-operated extinguishers mandatory. No safety seal during competition. Must be activated leaving service park, on road sections, special stages, parc fermé. Malfunctioning/defective = reported to Stewards; penalty up to exclusion.

=== TIME CARDS ===
Art.19.3.2: Only marshals may make entries (except sections marked "for competitor's use").
Art.19.3.3: Missing mark/signature OR missing time entry OR failure to hand in time card at any control = crew retired at that control.
Art.19.3.4: Divergence between crew's time card and official documents = CoC inquiry.

=== ON-BOARD CAMERAS & TRACKING ===
Art.18.1.1: Camera must clearly show driver's eye view; alternate power source required. Highly recommended — primary evidence for disputes.
Art.18.2: All cars must have organiser-provided tracking system. Checked at scrutineering.
Art.18.1.5/18.2: Any interference with camera or tracking system = reported to Stewards.

=== RESULTS ===
Art.64.1: Results = all SS times + road section penalties + all other time penalties.
Art.64.2: Publication order: Unofficial (during rally) → Partial Unofficial (end of Leg) → Provisional (end of rally) → Final (approved by Stewards).
Art.64.3: Dead heat: best time on first non-SSS stage decides winner.

=== PROTESTS ===
Art.65.1: Right to protest: COMPETITORS ONLY. Must be IN WRITING. One protest per competitor involved (file separately for each). Addressed to CoC or assistant; if CoC absent = Jury or Stewards.
Art.65.2.1: Protest deposit: UGX 250,000 — cash or Mobile Money. Mobile Money: proof of payment required or protest inadmissible. Deposit returned ONLY if protest upheld.
Art.65.3.1: Technical protest requiring dismantling: additional deposit set by Stewards. Protester pays costs if unfounded; protestee pays if upheld.

=== RIGHT OF REVIEW ===
Art.65.3.3: Grounds: significant NEW element unavailable at time of original decision. Filed by: either party directly affected OR FMU Deputy VP/Sporting Commission.
Art.65.3.3f: Deadline: 96 hours from end of competition (max 24hr extension by Stewards).
Art.65.3.3h: Deposit: UGX 500,000. Half returned if review upheld. FMU Sporting Commission/Deputy VP exempt from deposit.
Art.65.3.3d: Review has NO suspensive effect on original decision.
Art.65.3.3e: Stewards' sole discretion whether new element is significant — NOT subject to appeal.

=== APPEALS ===
Art.65.4: Appeal Deposit: UGX 1,000,000.
App.R full scale: NRC/International to tribunal or FMU Appeal Court=UGX2M | Below NRC to tribunal=UGX250k | Below NRC against tribunal decision=UGX325k | Right of Review=UGX500k | FMU National Court of Appeal (non-championship)=UGX1M | Individual to FMU Court=UGX250k | Individual to National Court=UGX500k | Licensed official=UGX150k.
Art.1.9: Safety/entry irregularity decisions: immediately binding even on appeal. Other matters: penalty suspended pending appeal but competitor shown in penalised position; cannot appear at prize-giving in better position unless appeal won.

=== PRIZE GIVING ===
Art.66.4: Attendance MANDATORY for all competitors who completed rally. Missing any part without written CoC permission = UGX 1,500,000 penalty imposed by FMU.
Art.66.5: Must appear in competition wear or sponsors' attire.
Art.66.2: Olympic-style podium mandatory for NRC events for overall top 3.
Art.66.3: Awards may be presented while results are provisional; must be returned if results change.
App.IV Art.1.1: Podium ceremony within 2 hours of last car arriving at final service.
Art.67.1/67.2: Annual FMU prize-giving: Championship winners must attend. Absence without force majeure = fine.

=== TYRES ===
Art.13.1.2: Moulded tyres only. Hand cutting/modification of tread pattern prohibited.
Art.13.1.3: Chemical/mechanical treatment of tyres prohibited.
Art.13.1.9: Tarmac tyre: tread depth not less than 1.6mm over at least 3/4 of tread pattern at all times.
Art.13.12: Min 1 spare wheel, max 2 spare wheels. No wheel loaded/unloaded outside service parks or authorised tyre change areas.
Art.13.7: Tyre controls may be done at any time. Non-conforming tyre: marked, must not be used.
Art.13.10: Tyre pressure adjustment permitted: when waiting time between TC and SS start >13 min, OR in regroups >10 min followed by a stage.

=== CAR CLASSES ===
RC1: WRC/National 1.6T, S2000 1.6T with 28mm restrictor.
RC2: S2000 2.0 Atmospheric, R5/R4/NR4, Group A 1600-2000cc, Super 1600, R2/R3 variants.
RC3: R3 Turbo up to 1620cc, R3 Diesel up to 2000cc, Group A up to 1600cc.
RC4: R2 up to 1600cc, Kit-car up to 1600cc, Group N 1600-2000cc, Group N up to 1600cc.
RC5/NATIONAL: R1, 2WD non-homologated up to 2000cc, FIA R5 out of homologation, expired homologation cars.
S CLASSIC: Pre-1985 models per Appendix J Art.253.
NATIONAL SUPER A: Group A regulations with 34mm restrictor.
SPV: Not in original form re: body/engine. 33mm turbo restrictor. All road legal vehicles.
2WD Championship (Art.7.2.2): Max 2000cc. Showroom 2WD with 1000cc turbo or NA engines permitted.
Art.12.2: FMU Technical Passport mandatory for ALL cars.
Art.25.1: Car class may be changed at scrutineering if car does not match entered class.

=== BULLETINS ===
Art.2.2: Bulletin clarifies/completes SSRs ONLY. CANNOT change or amend Rally Sporting Regulations — only a FMU waiver can. Before admin checks: by organiser with FMU approval. During competition: by Stewards (itinerary changes by CoC but Stewards must be advised). Must be numbered, dated, on yellow paper/background. Competitors must confirm receipt by signature.

=== DRIVING CONDUCT ===
Art.34.1.1: Crews must always behave in sporting manner.
Art.34.1.5: On road sections/public roads: car may only be driven on four freely rotating wheels. Non-compliance = retired + possible additional penalty.
Art.34.1.6: Driving with badly damaged windscreen obstructing vision = forbidden. Stewards may prohibit crew. Crew may restart under Art.54. Without windscreen: both crew must wear EN1938 goggles or full face helmet with closed visor.
Art.34.1.4: Must always drive in direction of special stage (except to effect a turn round).

=== COMPETITION NUMBERS DISPLAY ===
Art.27.1: Organiser provides panels. Must be affixed before scrutineering. Mandatory advertising within panels is obligatory — cannot be refused or modified.
Art.27.2: Front door panels: 67cm x 17cm. Matt black number box at front. Fluorescent yellow numerals 14cm high.
Art.27.3: Rear window: max 30cm x 10cm at bottom centre. Adjacent 15cm x 15cm fluorescent orange number.
Art.27.4: Side windows: 20cm high fluorescent orange numbers adjacent to crew names.
Art.27.5: Roof panel: 50cm x 52cm, top towards front of car.
Art.27.6: Front plate: rectangle 43cm x 21.5cm with competition number and rally name.

=== DRIVER/CO-DRIVER NAMES DISPLAY ===
Art.28.1: Initial(s) + surname + national flag on rear side windows, both sides. White Helvetica 6cm high. Driver's name is upper name on both sides.
Art.28.3: Names also on front fenders.

=== ADVERTISING ===
Art.29.1: Any advertising allowed if: authorised by law, not offensive, not political/religious, doesn't obstruct vision.
Art.27.1.2: Mandatory organiser advertising is obligatory — cannot be refused or modified.
Art.29.4.1: Optional organiser advertising refusal: max extra charge = double entry fee, absolute max UGX1,000,000.
Art.29.4.2: No extra fee for optional advertising for car make/tyres/fuel/lubricant if competitor justifies refusal to Stewards.

=== INSURANCE ===
Art.21.2: Insurance must cover civil liability towards third parties. In effect from first competition element to end of rally or permanent retirement/disqualification.
Art.21.3: Service vehicles and reconnaissance cars are NOT covered by rally insurance.

=== TEAM CHAMPIONSHIP ===
Art.7.3.1: Team must have >2 crews. Register + pay fee. Appoint licensed Team Manager. Must field 3 nominated crews per round including at least 1 x 2WD crew.
Art.7.3.1f: Only 2 best placed nominated crews score points. Third crew neither scores nor detracts.
Art.7.3.2b/c: Title to team with highest points from 8 NRC events. Minimum 3 registered teams per event required.

=== CRC — CLUBMAN RALLY CHAMPIONSHIP ===
Art.7.4.1: 2nd year competitors who met Autocross requirements previous year. Must complete full year AND be classified finisher in at least 4 CRC events for promotion to NRC. CRC driver NOT eligible for foreign competitions.
Art.7.4.2: Fail to qualify for NRC: FMU CC may relegate to Autocross.
Art.7.4.3: Classified finisher after completing at least 60% of total competitive distance.
Art.7.4.4: CRC co-drivers with Class C licence: NOT eligible for NRC.
Art.7.4.5/7.4.6: Experienced co-driver (Class A) becoming 1st Driver: must compete in CRC for that full season, cannot score NRC/2WD points.

=== MAXIMUM FINES BY AUTHORITY ===
CoC (non-FIA/FIM events): max UGX250k | Stewards: max UGX750k | FMU CC: max UGX2.5M | Disciplinary Court: max UGX3M | Court of Appeal: max UGX5M.

=== LICENCE CATEGORIES & FEES ===
Class A: Premier/Div1 drivers + ALL co-drivers = UGX250,000.
Class B: Division 2 drivers = UGX200,000.
Class C: CRC/Autocross Cadet/first-year co-drivers = UGX150,000.
Class D: Junior <18yrs, Closed Circuit only = UGX150,000.
Class K: Karting.
Day Licence Sprint/Autocross/Drifting/Karting = UGX100,000. Motorcycle Day Licence = UGX50,000.
International Licence: USD250.
Team Registration: UGX1,000,000. Team Manager Licence: UGX250,000.
Officials: A=UGX100k | B=UGX80k | C=UGX60k | D=UGX60k.
50% surcharge on all licence applications after June 30 (App.R Art.5). Licences expire Dec 31. Duplicate: 50% of original fee.
Competing without/wrong licence: UGX1,000,000 + loss of all points (App.R Art.2.2.7).
Organiser allowing unlicensed official: UGX300,000 per official.
Unauthorised event: 1st=3 months suspension | 2nd=12 months | 3rd=Worldwide Life Ban (App.T Art.11).
Disqualification: PERMANENT, only by FMU Executive, always international — notified to all ASNs.

=== ORGANISING PERMITS ===
Only FMU or FMU-affiliated clubs may organise (App.XX Art.2a). Application at least 8 weeks before event. Must obtain permissions from property owners, Police, Local/Government authorities. No event launched before FMU Certificate of No Objection. Late application: permit fee doubled. Date change: 20% penalty. Late results submission: UGX10,000/day. Failing to display FMU logos: up to UGX150,000.

=== 2026 FMU COMPETITOR NUMBERS ===
#1-Ronald SEBUGUZI|#3-Duncan Mubiru|#4-Ponsiano Lwakataka|#5-Peter KALULE|#6-Aine Kaguta 'Sodo'|#7-Mansoor LUBEGA|#8-Amir KAVUMA|#9-Haruna KATAZA|#10-Mike MUKULA Jr|#11-Julius SEMAMBO|#12-Didas MASIKO|#14-Musa Segabwe|#15-Samuel BWEETE|#16-Faizal KAYIRA|#17-Yassin Nasser|#18-Umar DAUDA|#19-Ibrahim LUBEGA|#20-Hassan Alwi|#21-Nasser MUTEBI|#22-Joshua MUWANGUZI|#23-Edward KIRUMIRA|#24-Isaac SSOZI|#25-Oscar NTAMBI|#26-Odeon TUMWEBAZE|#27-Samuel WATENDWA|#28-WO1 Ismail LULE|#29-Sadat NEGOMBA|#30-Ahmed SENYONJO|#31-Ali OMAR 'Bobo'|#32-Susan MUWONGE|#33-Fred BUSULWA|#35-John CONSTA|#36-Francis OMO|#37-Dr.Henry MASERUKA|#38-Dr.Godfrey NSEREKO|#39-Yassin MUKASA|#40-Nasser RATIB|#41-Jamada LWABAGA|#42-Timothy GAWAYA|#43-Moustapha MUKASA|#44-Walter Kibande|#45-Ahmed Kateete jr|#46-Kevin Bebeto|#47-Shid MAKUMBI|#48-Jas MANGAT|#49-Abaasi MAYINJA|#50-Byron RUGOMOKA|#51-Amir KAWEESA|#52-Issa NYANZI|#53-Omar MAYANJA|#54-Andrew MUSOKE|#55-Gilberto BALONDEMU|#56-Godfrey KIYIMBA|#57-Patrick SEBAMBULIDDE|#58-Ali MOHAMMED|#59-Patrick RUYONGA|#60-Humphrey KAWUKI|#61-Ian Hanz BACHU|#62-Sande MUBIRU|#63-Geofrey MUNYEGERA|#64-Samuel SEKANDI|#65-Nasib SESSANGA|#66-Topher KATEERA|#67-Chris Bahizi|#68-Robert K.SENTONGO|#69-Doreen ASIIMWE|#70-John P.KYEBAMBE|#71-Ukasha Mugoya|#72-Sharif MUYANJA|#73-Najib Ssempijja|#74-Japhethi Lugayizi|#75-Salim GASEMBA|#76-Abaasi SEBUNYA|#77-RETIRED(memory Bike 77)|#78-Muzamir Watolya|#79-Fred SENKUMBA|#80-Muzamir Watolya|#81-Fred SENKUMBA|#82-Yusuf BUKENYA|#83-Frank TATYA|#84-Edson Mungyereza|#85-Kuku RANJIT|#86-Wyclif Bukenya|#87-Shafic SSENDAGIRE|#89-Paul KASOZI|#90-Muyanja Sabiti|#91-Umar Kakyama|#92-Innocent Bwamiki|#93-John Burrows|#94-Vicent Muwanguzi|#95-Abdul Kateete|#96-Ahmed Mayinja|#97-Salim KYEBAGADA|#98-Mansoor SSANYA|#99-Arthur Blick|#100-Jonas KANSIIME|#101-Sempera Kakule|#102-Fred Wampamba|#103-Happy K.Richard|#104-Farouk Ssentongo|#105-Unissan Bakunda`;

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
      if (!response.ok) {
        const errMsg = data?.error?.message || JSON.stringify(data);
        setMessages([...newMessages, { role: "assistant", content: `⚠️ API Error (${response.status}): ${errMsg}` }]);
      } else {
        const reply = data.choices?.[0]?.message?.content || "No response received.";
        setMessages([...newMessages, { role: "assistant", content: reply }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: `⚠️ Connection error: ${err.message}` }]);
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
