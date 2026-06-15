**CHALLENGE TITLE**

# Ready for Takeoff

**How might we turn a flight's delay risk into a call an operations team will actually act on?**

## PARTNER

DATAbility GmbH is an industrial AI and engineering company for decision intelligence born out of the aerospace sector from TU Darmstadt in 2018. DATAbility fuses deep engineering domain knowledge with advanced data science, simulation and optimization approaches to build digital twins, predictive maintenance systems, and decision intelligence solutions for complex infrastructure, critical assets as well as mobility and transport networks. Our mission is to transform industrial data into transparent, precise, and highly actionable recommendations - moving away from "black box" AI towards trusted, explainable engineering solutions.

## THE PROBLEM

Every day, thousands of flights are delayed or cancelled. For an airline that adds up to billions a year, and on any given day it turns a tidy schedule into a mess.

What makes it expensive is the way it spreads. A plane that lands late leaves late on its next leg, and the one after that. The crew runs into its duty limit. Passengers miss connections. By evening, one delay from the morning has turned into a dozen. Someone has to catch that early, and that someone sits at the airline's operations desk, the dispatcher or duty controller who keeps the day running. Hours before a flight, they decide what is at risk and what to do about it, whether to hold a connection, move an aircraft, or call in a standby crew.

The catch is that the reason a flight slips is usually nowhere near the flight. It is weather closing in on the departure airport, or a knock-on from a delay two legs back. The data that would show it coming is all there, just scattered: the schedule in one system, the weather in another, the live state of the fleet somewhere else again. Nobody has pulled it into a straight answer to the only question that matters at 7am, which flights are about to go wrong, and why. So the desk spends the day reacting. And when a tool does put a number on a flight, the controller usually ignores it, because a risk score with no reason attached is just one more thing blinking on a screen.

## THE OPPORTUNITY

This is one of the biggest costs in aviation that someone can actually control, and most of the business is fighting it with tools that only describe what already happened. Airlines, airports and ground handlers would all pay for something that flags the right flights early and gives a reason good enough to act on. It is not only aviation either. Anything that runs to a timetable and falls over when one piece slips has its own version of this. The product that does it well mostly is not built yet.

So there is room. Pick who you are building for, as long as they run the operation rather than sit in seat 14C, and decide how you help them: a morning read on the day's riskiest flights, a fast call when a storm is an hour out, a map of where one late aircraft is about to drag the rest of the schedule. That part is yours.

The step worth getting right is the one most tools skip. A model can say a flight is 60 percent likely to be late. Fine, but 60 percent is not a decision. What does the controller do with it, and what do they need to see to trust it enough to act? That is the actual challenge here, more than the model.

## CONSTRAINTS (hard boundaries only)

- Build for the industry, not the passenger. Your user works the operation, a named role on the desk, not "the airline" in general. Pick one and build for them.
- No black box. A score that drives a decision has to be explainable to a non-engineer. The operator needs to see why a flight is flagged and what is driving it, and trust it without reading code.
- Use real flight and weather data. Models and scenarios are expected; the flights, airports and weather behind a demo are not invented.

## DELIVERABLES

Standard LAUNCH Build Days deliverables:

1. A sharp customer and problem: who exactly makes the decision your tool supports, and what public evidence shows the pain is real. Desk research is enough, no interviews expected over a weekend.
2. A solution concept with a clear value proposition: what you are building, for that user, and why it beats the dashboards-and-gut-feel status quo.
3. A working tool on real data: it takes real flights and outside signals like weather and produces a delay risk with its reasons and a recommended action in view, not a bare score. A dashboard or interactive view is the obvious shape, but the format is yours. A narrow, deep slice beats a broad, shallow demo.
4. An Expo pitch: five minutes to present and demo, then four minutes of jury Q&A. Show the working thing, not slides.

## EVALUATION CRITERIA

| Criterion | Description |
| --- | --- |
| Applicability | How realistic and user-friendly is your prototype? Can an operator actually use it for better decision-making? |
| Marketability | Does your solution solve a high-value problem for airlines or airports? Is the business case and the path to implementation convincing? |
| Explainability | Did you apply logical reasoning to the data, and how effectively does your tool communicate why a decision should be made? |
| Pitch and Team | Clear, compelling, confident. The team gets both the operations desk and what the data can and cannot say. |

## RESOURCES

*Start here* - The kickoff starter kit: a pre-joined flights-and-weather sample, the join script to scale it up, and the operations-desk primer. The fastest way into the problem.

- **Flight Delays and Cancellations (US DOT)**, kaggle.com/datasets/usdot/flight-delays: a large labelled history of delays and their categories. Your training and validation backbone.
- **Airline Delay Cause (US BTS)**, kaggle.com/datasets/abdelazizel7or/airline-delay-cause: delays broken down by cause (carrier, weather, late aircraft, NAS). The "why" behind the number.

*Live flight and network state* - **OpenSky Network**, opensky-network.org: open real-time and historical flight tracking. Useful for live state and network-effect modelling.

*Weather (the external driver)* - **Open-Meteo**, open-meteo.com: free historical and forecast weather APIs, no key required. The fastest way to add weather to a flight. - **NOAA / Aviation Weather (METAR/TAF)**, aviationweather.gov: the weather reports operations actually use.

*Inspiration (reference, not to copy)* - FlightAware and flightradar24 for how flight state is surfaced today; airline operations-control (OCC) tooling for the decision context this lives in.
