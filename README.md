# Aerospace03

## Team Miron
- Anastasiya Henechka, Comp. Business Analytics; Maths & Economics
- Martí Roca Bosch, Business Administration
- Miriam Weigand, Physics
- Aaron Kreuzer, Computer Science

## Challenge: DATAbility |  Ready for Takeoff

Every day, thousands of flights are delayed or cancelled. For an airline that adds up to billions a
year, and on any given day it turns a tidy schedule into a mess.
What makes it expensive is the way it spreads. A plane that lands late leaves late on its next leg,
and the one after that. The crew runs into its duty limit. Passengers miss connections. By evening,
one delay from the morning has turned into a dozen. Someone has to catch that early, and that
someone sits at the airline’s operations desk, the dispatcher or duty controller who keeps the day
running. Hours before a flight, they decide what is at risk and what to do about it, whether to hold
a connection, move an aircraft, or call in a standby crew.
The catch is that the reason a flight slips is usually nowhere near the flight. It is weather closing in
on the departure airport, or a knock-on from a delay two legs back. The data that would show it
coming is all there, just scattered: the schedule in one system, the weather in another, the live state
of the fleet somewhere else again. Nobody has pulled it into a straight answer to the only question
that matters at 7am, which flights are about to go wrong, and why. So the desk spends the day
reacting. And when a tool does put a number on a flight, the controller usually ignores it, because
a risk score with no reason attached is just one more thing blinking on a screen.

## Our Customer

**Who:** the **duty controller / dispatcher role in the Operations Control Center (OCC)**
of **Discover Airlines**, the Lufthansa Group leisure carrier based at **Frankfurt Airport
(FRA)**.   


**Why:** 
- they make critical decisions regarding aircraft routing, crew assignments, and passenger connections hours ahead of departure
- other roles (e.g. Hub controller) act AFTER the problem has already manifested

**Goal**  
Cascade prevention through earlier dispatcher intervention, as the late aircraft cascade is simultaneously the most frequent cause AND the longest delay duration per incident.

**Other Cociderations**
- hub operation the OCC is staffed by several controllers at once under a duty manager
typically split by sector or fleet (short-haul feeder vs. A330/A350 long-haul)
- over the day, there are shift handovers under a duty managers

**What this means for us:** 
- we are building for a *shared* desk, not a single seat. The same
risk read has to make sense to whoever is on shift, survive a handover, and let several controllers work different slices of the same day.

**Why Discover at FRA:**  
Discover flies a mixed short- and long-haul leisure network
(A320-family feeder plus A330/A350 long-haul) out of one of Europe's most congested hubs.That combination is exactly where delays compound: a late short-haul inbound can strand a wide-body's connecting load, and Frankfurt's weather and slot pressure mean the trigger is usually upstream of the flight that ends up late.

## Our product
**A morning briefing tool for airline operations dispatchers.**  
Features:
- traffic light risk labels
- naming delay resons
- recommend actions


# Wingman \- Business plan

LAUNCH hackathon \- AeroSpace edition  
Challenge partner: DATAbility GmbH

  2. ## Persona’s description

     The person who must catch a delay before it cascades sits at the Operations Control Center (OCC). At Discover Airlines, our airline target, this role is called Flight Operations Controller.  
       
     Persona:  
     Thomas Brandt, 45, Flight Operations Controller, Heart of Ops, Discover Airlines, Frankfurt.  
       
     Role definition (Source: Lufthansa Group / SunExpress, Flight Operations Controller job posting, Frankfurt. WIZBII ([en.wizbii.com](http://en.wizbii.com))):  
- Central control of all flights operated by the airline in cooperation with other operating departments.  
- Continuous monitoring of all aircraft movements to ensure the best possible assistance in the event of a deviation from the operational flight programme.  
- Take necessary measures in the event of a technical irregularity and/or weather conditions which require diversion, re-routing, delay or cancellation.

		Discover Airlines context:

- 30 aircraft fleet (14 Airbus A330 long-haul \+ 16 Airbus A320 short/medium-haul), 62 destinations, \~2,100 employees, headquartered at Frankfurt Airport. ([Source: Discover Airlines official newsroom, October 2025\. newsroom-en.discover-airlines.com](http://newsroom-en.discover-airlines.com))  
- The “Heart of Ops”, defined by Discover as the centre from which they "manage the international deployment of aircraft and crews for both hubs, ensuring guests and their baggage arrive reliably and on time worldwide.” ([Source: Discover Airlines career page. discover-airlines.com/xx/en/about-us/career](http://discover-airlines.com/xx/en/about-us/career)).

  3. ## Persona’s activity analysis

     Thomas arrives at 06:00. He has 15 flights to manage before noon. He opens three screens: Flightradar24, an internal rotation Excel, and a chat channel with ground handling agents at Fraport and partner airports (AENA, GTAA, etc.). His first 40-60 minutes consist of manually reconstructing whether each incoming aircraft will arrive in time for its next rotation.  
       
     The questions he answers manually, every morning, from scattered sources:  
- Where is each aircraft right now, and what is its real Estimate Time of arrival (ETA)?  
- Is the scheduled turnaround time sufficient given the real arrival time?  
- Does the crew of the incoming flight have enough duty time left for the outbound leg?  
- Is there a EUROCONTROL slot restriction that will constrain departure?  
- Is the weather at origin or destination deteriorating within the flight window?


  When he detects a problem at 08:30 that was detectable at 06:30, his action window has collapsed. Calling the standby crew too late means the flight departs delayed. A single long flight delay of 3 or more hours on a controllable cause triggers EU261 compensation of up to €600 per passenger, which is up to €168,000 for a full aircraft. ([Source: EU Regulation 261/2004 compensation scale: €600 for flights over 3,500 km delayed 4+ hours. Flightright.com](http://Flightright.com))

2. # Solution: Wingman

   1. ## Value proposition

3. # Market opportunity

   1. ## Market size

      

| Market | Size / CAGR |
| :---- | :---- |
| Global aviation software market (2025) | USD 13.13 billion |
| Projected size by 2030 | USD 18.12 billion (CAGR 6.64%) |
| EU261 annual airline cost (current) | €8.1 billion/year |
| EU261 projected cost under reform | \>€15 billion/year |

Source: Aviation software market: Mordor Intelligence, 2025\. EU261 figures: IATA / A4E / Aviation24.be, October 2025\. Controllable delay share: OAG & Microsoft, 2025\.

2. ## Target segment

   Segment 1 \- Small and Medium Leisure / Regional Airlines  
   European leisure and regional carriers operating 15-50 aircraft who manage their OCC with 2-5 people per shift, using combinations of Flightradar24, Excel, and phone calls. Enterprise OCC suites are economically and operationally out of reach.  
     
   Archetypal target customers comparable to Discover Airlines:  
* Condor (Germany) — \~40 aircraft, leisure long-haul from Frankfurt/Dusseldorf  
* SunExpress (Germany/Turkey, Lufthansa/THY JV) — 70+ aircraft, leisure short/medium-haul  
* Volotea (Spain/France) — \~45 aircraft, European point-to-point  
* Luxair (Luxembourg) — \~20 aircraft, regional European network  
* Transavia Netherlands — \~40 aircraft, leisure and city routes

  Source: Fleet sizes: respective airline Wikipedia pages and Simple Flying, 2025\. Listed as illustrative comparable operators, not confirmed prospects.


  Segment 2 \- Scale up the product from small airlines to big ones.

  3. ## Why now?

     Three forces make this the right moment:  
- EU261 reform: trilogue negotiations ongoing in Brussels, with negotiations regarding the option of nearly doubling airline compensation obligations by 2026/27. Every preventable delay is becoming more expensive.  
- Traffic at record levels: 11.12 million European flights in 2025, surpassing pre-pandemic 2019, while average Air Traffic Flow Management (ATFM) delay still stands at 2.4 min/flight. Volume is up, but operational tools are not.  
- EU AI Act: high-risk AI systems (including those influencing safety-critical operational decisions) face mandatory explainability requirements fully applicable from 2026\. A black-box score is not compliant. A causal narrative is.

  (Source: EU traffic: EUROCONTROL Data Snapshot \#57, January 2026\. EU AI Act explainability: European Commission, Regulation (EU) 2024/1689, applicable 2026\. EU261 reform: Aviation24.be, October 2025.)

4. # Competitive landscape

   1. ## Direct competitors: Enterprise OCC / Disruption Management

| Competitor | Target | Explainability | Pre-delay action | SMB access | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Lufthansa Systems NetLine/Ops++ aiOCC | Large carriers / groups | Partial (impact metrics) | Yes — prescriptive RL | No | First RL-based prescriptive OCC tool. Lufthansa Group, EL AL, Riyadh Air. Enterprise SaaS. |
| IBS iFlight / iFlight Core | Large carriers; Core \= SMBs | None public | Predictive recovery | iFlight Core only | iFlight Core targets SMBs but is a full ops platform, not a lightweight advisory layer. |
| Amadeus Flight Ops Control | Large carriers | None | Reactive only | No | All-in-one suite. Reference: Qantas. Enterprise license/SaaS. |
| Jeppesen Ops Control | Large/medium carriers | None | Reactive optimizer | No | Aircraft recovery solver. Enterprise. |
| CAE Flightscape | Large carriers | Partial — 'traceable logic' | Yes — scenario-based | No | Closest competitor on explainability. Launch customer: Azul. Enterprise. |
| SITA Mission Watch | Global carriers | None | None | No | Flight tracking and weather for dispatchers. No OCC advisory. |

Source: Lufthansa Systems: lhsystems.com; IBS: ibsplc.com; Amadeus: amadeus.com; CAE: cae.com; SITA: sita.aero. All accessed 2025-2026.

2. ## Indirect competitors \- Prediction-First Tools

| Competitor | What it does | Causal narrative | OCC action rec. | European SMB fit |
| :---- | :---- | :---- | :---- | :---- |
| FlightAware Foresight (Collins/RTX) | ML-based ETA and taxi predictions. 30-50% more accurate than conventional methods. | No | No | No — enterprise data feed |
| Lumo (thinklumo.com) | Delay prediction days ahead, cause labels, alternative suggestions, FAA traffic-flow forecasting up to 1 week out. | Partial (cause label) | Partial (alternatives) | No — US/Canada focus |
| Assaia ApronAI | Computer-vision turnaround time prediction at gates. | No (turnaround only) | No | Growing |
| Flightradar24 / FlightAware standard | Real-time flight tracking and basic alerts. | No | No | Yes (free) — the status quo |

   3. ## The market gap

      The gap Wingman fills:  
      Prediction-first tools (Foresight, Lumo) predict but do not recommend OCC actions and do not explain causally.  
      Enterprise suites (NetLine aiOCC, CAE) have partial explainability but are inaccessible to SMB airlines.  
      No tool leads with a causal-chain narrative \+ specific pre-cascade action as a standalone, lightweight advisory layer.  
      No European tool specifically serves the 15-50 aircraft leisure and regional airline segment.  
        
      Wingman occupies the intersection of three gaps: explainability, pre-cascade action, and SMB accessibility.

5. # Business model

   1. ## Revenue model

Wingman uses a staged pricing model designed to match the risk appetite and resources of each customer segment. SaaS subscription is the industry-dominant model (59.25% of 2024 aviation-software revenue per Mordor Intelligence) and the only format that fits a small carrier's budget without upfront CapEx.

Stage 1 \- Pilot-First (Entry)  
A free or low-cost proof-of-value pilot on one base or one fleet subset. Time-bounded (4-8 weeks), produces a measurable delay-reduction outcome, requires no IT migration. This mirrors DATAbility's own PoC-first commercial methodology and lowers the friction of a first aviation sale. The airline has nothing to lose. We get a reference customer and real operational data.

Stage 2 \- Per-Aircraft-Per-Month SaaS (Core Revenue)  
After the pilot validates savings, conversion to a tiered monthly subscription priced per managed aircraft. The unit of value delivered is per-aircraft delay prevention, making per-aircraft pricing both intuitive and scalable with fleet size.

Stage 3 \- Outcome-Based Upsell (Scale Revenue)  
Once a credible savings baseline exists (measurable delay-minutes avoided and EU261 compensation prevented), we introduce an outcome-based component: a gain-share on savings beyond a defined threshold. This is precedented in aviation (Rolls-Royce 'Power by the Hour', GE Aviation Engine Services) and aligns incentives between Wingman and the airline. It requires audit-grade attribution, which Stage 2 operational data provides.  
(Source: SaaS dominance: Mordor Intelligence, Aviation Software Market, 2025\. Outcome-based pricing precedent: Rolls-Royce Power by the Hour, documented in aviation industry press.)

2. ## Go-to-market

Phase 1 \- Hackathon to First Conversation (Now)  
Phase 2 \- Pilot with one airline (preferably Discover Airlines)  (0-6 months)  
Phase 3 \- Regional and medium-sized airlines expansion (6-18 months)  
Phase 4 \- Big airlines expansion (18+ months)

6. # Alignment with business DATAbility Evaluation criteria

   1. ## Challenge given evaluation criteria

| Criterion | How TakeoffIQ addresses it |
| :---- | :---- |
| Applicability | Built for one named role (Flight Operations Controller), one named airline (Discover Airlines), one specific moment (06:00 shift start). Interface tested against real workflow documented in public job postings. |
| Marketability | Consequences quantified with primary sources. EU261 reform creates a hard regulatory deadline. Segment gap confirmed by independent market research. |
| Explainability | Plain-language narrative. No score without reason. No reason without action. Compliant with EU AI Act explainability requirements from 2026\. |
| Pitch & Team | 5-minute demo of a working prototype on real data. Persona, problem, and solution traceable to cited public sources. No invented figures. |

