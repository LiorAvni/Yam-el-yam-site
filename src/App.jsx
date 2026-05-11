import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import {
  AlertTriangle,
  Backpack,
  Bus,
  CalendarDays,
  ChevronDown,
  Clock,
  Droplets,
  Flag,
  Home,
  MapPinned,
  Mountain,
  Navigation,
  Tent,
  Utensils,
  Waves,
} from "lucide-react";

const ROUTE = {
  title: "ים אל ים: אכזיב ← כנרת",
  subtitle: "תכנון מלא לשלושה ימים עם לינה באבירים ובחניון לילה פיתול מירון",
  totalKm: "70.1 ק״מ",
  climb: "כ־1,780 מ׳ עלייה",
  descent: "כ־2,000 מ׳ ירידה",
  direction: "מהים התיכון לכנרת",
  dates: "שישי 15.5 עד ראשון 17.5",
};

const DAYS = [
  {
    day: "יום 1",
    date: "שישי 15.5",
    title: "אכזיב ← נחל כזיב ומונפורט ← חניון אבירים",
    distance: "כ־19.8 ק״מ",
    difficulty: "בינוני־קשה",
    sleep: "חניון אבירים",
    icon: Waves,
    color: "blue",
    goal: "להתחיל מהים, להתקדם בנחל כזיב ולסיים לפני חושך באבירים.",
    timeline: [
      ["06:00", "יציאה מהבית בפתח תקווה"],
      ["09:30–10:15", "הגעה לאכזיב / גן לאומי אכזיב"],
      ["10:15", "נגיעה בים, צילום קצר, מילוי מים"],
      ["10:30", "תחילת הליכה"],
      ["12:30–13:00", "עצירת צהריים קצרה"],
      ["14:00–15:30", "אזור נחל כזיב / מונפורט"],
      ["17:30–18:45", "הגעה לחניון אבירים, הקמת אוהלים"],
    ],
    notes: [
      "זה היום שבו קל להתעכב בתחילת המסלול. לא להפוך את אכזיב לעצירת חוף ארוכה.",
      "בנחל כזיב לא שותים ממי הנחל. יוצאים מאכזיב עם מים מלאים.",
      "חניון אבירים הוא נקודת לינה טובה כי הוא מחלק נכון את המסלול לשלושה ימים.",
    ],
    water: "לצאת מאכזיב עם 3 ליטר לאדם לפחות. אם מתחילים מאוחר או חם — 3.5–4 ליטר.",
    food: "בוקר בדרך; צהריים קר במסלול; בערב באבירים ארוחה פשוטה כמו קוסקוס/נודלס/אורז מהיר עם טונה או עדשים.",
  },
  {
    day: "יום 2",
    date: "שבת 16.5",
    title: "אבירים ← אלקוש ← חורבת חממה ← הר מירון ← פיתול מירון",
    distance: "כ־28.9 ק״מ",
    difficulty: "קשה מאוד",
    sleep: "חניון לילה פיתול מירון",
    icon: Mountain,
    color: "green",
    goal: "לעבור את היום הפיזי ביותר ולהגיע לפיתול מירון לפני חושך.",
    timeline: [
      ["05:00", "קימה"],
      ["05:30", "קיפול אוהלים וארוחת בוקר מהירה"],
      ["06:00", "יציאה מחניון אבירים"],
      ["08:30–09:30", "אזור גשר אלקוש / תחנת דלק"],
      ["11:30–12:30", "חורבת חממה — עצירה, אוכל, מילוי מים"],
      ["13:00", "יציאה מחורבת חממה"],
      ["14:00–15:30", "אזור הר מירון"],
      ["16:30–18:00", "הגעה לחניון לילה פיתול מירון"],
    ],
    notes: [
      "זה היום הקובע של הטיול. לצאת מוקדם, לשמור קצב, ולא לפתוח עצירות ארוכות.",
      "גשר אלקוש הוא נקודת עצירה, לא נקודת לינה מומלצת. החניון לא רשמי ואין בו מים.",
      "חורבת חממה היא נקודת מילוי מים חשובה וגם נקודת החלטה אם הקבוצה עומדת בקצב.",
      "פיתול מירון הוא יעד הלינה של היום השני. להגיע לפני חושך, למלא מים ולהתארגן לשינה מוקדמת.",
    ],
    water: "לצאת מאבירים עם 3 ליטר. למלא באלקוש אם אפשר. בחורבת חממה לצאת עם 2.5–3 ליטר לפחות עד פיתול מירון.",
    food: "לאכול משהו קטן כל שעה־שעה וחצי. צהריים קר בחורבת חממה. ערב פשוט בפיתול מירון, בלי מדורה.",
  },
  {
    day: "יום 3",
    date: "ראשון 17.5",
    title: "פיתול מירון ← נחל עמוד ← כנרת / גינוסר ← פתח תקווה",
    distance: "כ־21.4 ק״מ",
    difficulty: "קשה בגלל הזמנים",
    sleep: "סיום וחזרה הביתה",
    icon: Flag,
    color: "orange",
    goal: "לצאת מוקדם מאוד, לסיים בכנרת עד 13:30–14:30, ולצאת לתחבורה עד 15:30.",
    timeline: [
      ["04:45", "קימה"],
      ["05:15", "קיפול אוהלים"],
      ["05:30–05:45", "יציאה מפיתול מירון"],
      ["07:30–08:30", "התקדמות בנחל עמוד עליון / אזור השמורה"],
      ["10:00–11:00", "אזור נחל עמוד תחתון"],
      ["12:30–14:00", "התקרבות לכנרת / גינוסר"],
      ["13:30–14:30", "סיום מסלול"],
      ["עד 15:30", "יציאה בתחבורה מגינוסר / טבריה"],
      ["עד 19:00", "יעד הגעה לפתח תקווה"],
    ],
    notes: [
      "זה לא יום שמתחילים ב־07:00. יציאה מאוחרת תסכן את החזרה בזמן.",
      "בנחל עמוד הולכים רק באור יום. לא מתכננים הליכה בחושך.",
      "לא עושים עצירות רחצה ארוכות. המטרה היא לסיים ולהספיק תחבורה.",
    ],
    water: "לצאת מפיתול מירון עם 3 ליטר לאדם לפחות. אם הקבוצה איטית — 4 ליטר.",
    food: "בוקר מהיר תוך כדי קיפול. במהלך היום חטיפים/תמרים/טורטייה. צהריים רק בסיום או בדרך לתחבורה.",
  },
];

const WAYPOINTS = [
  { km: "0.2", name: "חניון לילה - גן לאומי אכזיב", type: "התחלה / מים / שירותים", note: "נקודת התארגנות טובה לפני יציאה. לא להתעכב יותר מדי." },
  { km: "13.0", name: "שמורת טבע מונפורט ונחל כזיב", type: "נקודת עניין", note: "אחד הקטעים היפים במסלול. לא שותים ממי הנחל." },
  { km: "19.8", name: "חניון אבירים", type: "לינה 1 / מים", note: "חניון לילה עם פח זבל וברז מים לפי ה־GPX." },
  { km: "29.1", name: "חניון לילה גשר אלקוש", type: "עצירה / לא מומלץ ללינה", note: "חניון לא רשמי, ללא מים. להשתמש כנקודת עצירה בלבד." },
  { km: "29.2", name: "תחנת דלק אלקוש", type: "גיבוי מים / קנייה", note: "תלוי פתיחה וזמינות. לא לבנות עליה כנקודת מים יחידה." },
  { km: "38.4", name: "חניון לילה חורבת חממה", type: "מים / צהריים / נקודת החלטה", note: "שולחנות וברז מים. מקום חשוב לעצירה ביום 2." },
  { km: "41.8", name: "הר מירון", type: "שיא גובה / נוף", note: "אזור גבוה ומרכזי במסלול. לא להתעכב יותר מדי ביום 2." },
  { km: "48.7", name: "חניון לילה פיתול מירון", type: "לינה 2 / מים", note: "יעד הלינה בשבת. שולחנות וברז מים לפי ה־GPX." },
  { km: "51.2", name: "שמורת נחל עמוד", type: "שמורה / מעבר", note: "קטע מרכזי ביום 3. לבדוק מראש דרישות רישום/כניסה וללכת רק באור יום." },
  { km: "60.4", name: "חניון לילה נחל עמוד תחתון", type: "מים / נקודת מעבר", note: "מסומן ב־GPX עם ברז מים. לא להסתמך בלי בדיקה בשטח." },
  { km: "70.1", name: "ימת הכנרת / גינוסר", type: "סיום", note: "תמונת סיום, התארגנות מהירה, ויציאה לתחבורה עד 15:30." },
];

const WATER_PLAN = [
  ["אכזיב", "0", "מילוי מלא לפני התחלה"],
  ["חניון אבירים", "19.8", "מים ללילה 1 ולבוקר יום 2"],
  ["תחנת דלק אלקוש", "29.2", "גיבוי בלבד, תלוי פתיחה"],
  ["חורבת חממה", "38.4", "מילוי חשוב ביום 2"],
  ["פיתול מירון", "48.7", "מים ללילה 2 וליום 3"],
  ["נחל עמוד תחתון", "60.4", "מסומן ב־GPX עם ברז מים"],
  ["כנרת / גינוסר", "70.1", "סיום"],
];

const FOOD = {
  principles: [
    "לא לבנות על מדורה. כל האוכל צריך לעבוד גם בלי אש פתוחה.",
    "ביום 2 לא עוצרים לבישול בצהריים. אוכלים קר ומהיר.",
    "כל אחד סוחב את האוכל האישי שלו, וארוחות ערב אפשר לחלק כציוד קבוצתי.",
  ],
  perPerson: [
    "3 ארוחות בוקר קלות: פיתה/טורטייה/גרנולה/חטיף חלבון.",
    "3 ארוחות צהריים קרות: טורטיות, טונה, טחינה, חמאת בוטנים, גבינה קשה.",
    "2 ארוחות ערב: קוסקוס/נודלס/אורז מהיר + טונה/עדשים/שעועית.",
    "6–9 נשנושים: תמרים, אגוזים, בייגלה, חלבה, חטיפי אנרגיה.",
    "אלקטרוליטים או איזוטוני — מומלץ במיוחד ליום 2.",
  ],
};

const GEAR = {
  personal: [
    "תיק 45–60 ליטר",
    "נעלי הליכה שכבר הלכתם איתן",
    "קיבולת מים של 3–4 ליטר",
    "כובע וקרם הגנה",
    "פנס ראש",
    "שק שינה ומזרן שטח",
    "בגדים להחלפה ושכבה חמה ללילה",
    "מעיל רוח/גשם קל",
    "סוללת גיבוי",
    "טלפון עם GPX אופליין",
    "שקיות אשפה ונייר טואלט",
    "פלסטרים לשפשופים ותרופות אישיות",
    "רב־קו, אשראי ומזומן קטן",
  ],
  group: [
    "אוהלים — לחלק משקל בין המשתתפים",
    "ערכת עזרה ראשונה",
    "גזייה וסיר קטן רק אם מותר ובטוח להשתמש",
    "מפה / ניווט אופליין אצל לפחות שני אנשים",
    "סוללת גיבוי קבוצתית",
    "שקיות אשפה גדולות",
    "רשימת טלפונים של הורים / איש קשר",
  ],
};

const DECISIONS = [
  { title: "יום 1: התחלתם אחרי 10:30", text: "עדיין ממשיכים לאבירים, אבל בלי עצירות ארוכות ובלי התעכבות במונפורט." },
  { title: "יום 2: הגעתם לאלקוש אחרי 10:00", text: "זה סימן לקצב איטי. ממשיכים, אבל מצמצמים עצירות ומוודאים שהקבוצה במצב טוב." },
  { title: "יום 2: הגעתם לחורבת חממה אחרי 13:30", text: "גבולי. אם יש עייפות חריגה או פציעה — עדיף לעצור בחורבת חממה ולא להיכנס לסיום יום בחושך." },
  { title: "יום 3: יצאתם מפיתול מירון אחרי 06:30", text: "אתם בלחץ מול החזרה הביתה. לקצר עצירות ולוותר על רחצה/הפסקות ארוכות." },
  { title: "יום 3: ב־12:00 אתם רחוקים מאוד מהכנרת", text: "לשקול יציאה בטוחה מהמסלול או קיצור. המטרה היא לחזור בריאים ובזמן." },
];

function classNames(...items) {
  return items.filter(Boolean).join(" ");
}

function Accordion({ title, children, defaultOpen = false, icon: Icon = ChevronDown }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={classNames("accordion", open && "open")}>
      <button className="accordionButton" onClick={() => setOpen((v) => !v)}>
        <span className="accordionTitle">
          <Icon size={20} />
          {title}
        </span>
        <ChevronDown className="chevron" size={20} />
      </button>
      {open && <div className="accordionBody">{children}</div>}
    </section>
  );
}

function RouteMap() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [status, setStatus] = useState("טוען מפה ו־GPX...");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView([32.99, 35.32], 10);

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    async function loadGpx() {
      try {
        const res = await fetch("/route.gpx");
        if (!res.ok) throw new Error("לא נמצא קובץ GPX");
        const text = await res.text();
        const xml = new DOMParser().parseFromString(text, "application/xml");

        const trackPoints = Array.from(xml.getElementsByTagName("trkpt")).map((pt) => [
          Number(pt.getAttribute("lat")),
          Number(pt.getAttribute("lon")),
        ]);

        const waypoints = Array.from(xml.getElementsByTagName("wpt")).map((pt) => ({
          lat: Number(pt.getAttribute("lat")),
          lon: Number(pt.getAttribute("lon")),
          name: pt.getElementsByTagName("name")[0]?.textContent || "נקודה במסלול",
          desc: pt.getElementsByTagName("desc")[0]?.textContent || "",
        }));

        if (!trackPoints.length) throw new Error("לא נמצאו נקודות מסלול בקובץ");

        const line = L.polyline(trackPoints, {
          color: "#0f766e",
          weight: 5,
          opacity: 0.92,
        }).addTo(map);

        const dotIcon = L.divIcon({ className: "mapDotIcon", html: "", iconSize: [14, 14] });

        waypoints.forEach((wp) => {
          L.marker([wp.lat, wp.lon], { icon: dotIcon })
            .addTo(map)
            .bindPopup(`<strong>${wp.name}</strong>${wp.desc ? `<br/>${wp.desc}` : ""}`);
        });

        map.fitBounds(line.getBounds(), { padding: [28, 28] });
        setStatus(`המפה נטענה: ${trackPoints.length.toLocaleString("he-IL")} נקודות מסלול ו־${waypoints.length} נקודות סימון.`);
      } catch (error) {
        setStatus(`שגיאה בטעינת המפה: ${error.message}`);
      }
    }

    loadGpx();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="mapCard">
      <div ref={containerRef} className="map" />
      <div className="mapStatus">{status}</div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="statCard">
      <Icon size={22} />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function DayCard({ day }) {
  const Icon = day.icon;
  return (
    <article className={classNames("dayCard", day.color)}>
      <div className="dayHeader">
        <div className="dayIcon">
          <Icon size={24} />
        </div>
        <div>
          <p className="eyebrow">{day.day} · {day.date}</p>
          <h3>{day.title}</h3>
        </div>
      </div>

      <div className="dayMeta">
        <span>{day.distance}</span>
        <span>{day.difficulty}</span>
        <span>{day.sleep}</span>
      </div>

      <p className="dayGoal">{day.goal}</p>

      <div className="timeline">
        {day.timeline.map(([time, text]) => (
          <div className="timelineItem" key={`${day.day}-${time}-${text}`}>
            <strong>{time}</strong>
            <span>{text}</span>
          </div>
        ))}
      </div>

      <div className="miniGrid">
        <div>
          <h4><Droplets size={18} /> מים</h4>
          <p>{day.water}</p>
        </div>
        <div>
          <h4><Utensils size={18} /> אוכל</h4>
          <p>{day.food}</p>
        </div>
      </div>

      <ul className="noteList">
        {day.notes.map((note) => <li key={note}>{note}</li>)}
      </ul>
    </article>
  );
}

function App() {
  const navItems = useMemo(() => [
    ["overview", "סקירה"],
    ["map", "מפה"],
    ["days", "ימים"],
    ["water", "מים"],
    ["food", "אוכל"],
    ["gear", "ציוד"],
    ["safety", "בטיחות"],
  ], []);

  return (
    <main>
      <header className="hero" id="overview">
        <nav className="topNav">
          <a href="#overview">ים אל ים</a>
          <div>
            {navItems.slice(1).map(([id, label]) => (
              <a key={id} href={`#${id}`}>{label}</a>
            ))}
          </div>
        </nav>

        <div className="heroContent">
          <p className="kicker">תכנון טיול מלא · GPX + לוגיסטיקה + ציוד</p>
          <h1>{ROUTE.title}</h1>
          <p className="subtitle">{ROUTE.subtitle}</p>

          <div className="heroActions">
            <a className="primaryButton" href="#days">לראות תכנון לפי ימים</a>
            <a className="secondaryButton" href="#map">לפתוח מפה</a>
          </div>

          <div className="statsGrid">
            <StatCard icon={Navigation} label="כיוון" value={ROUTE.direction} />
            <StatCard icon={MapPinned} label="מרחק" value={ROUTE.totalKm} />
            <StatCard icon={Mountain} label="עלייה" value={ROUTE.climb} />
            <StatCard icon={CalendarDays} label="תאריכים" value={ROUTE.dates} />
          </div>
        </div>
      </header>

      <section className="section" id="map">
        <div className="sectionHeader">
          <p className="eyebrow">GPX אמיתי</p>
          <h2>מפת המסלול</h2>
          <p>המפה טוענת את הקובץ `public/route.gpx` ומציגה את התוואי ואת נקודות הסימון מתוך הקובץ.</p>
        </div>
        <RouteMap />
      </section>

      <section className="section" id="days">
        <div className="sectionHeader">
          <p className="eyebrow">תכנון ביצוע</p>
          <h2>חלוקה לשלושה ימים</h2>
          <p>החלוקה המומלצת: יום ראשון עד אבירים, יום שני עד פיתול מירון, יום שלישי עד הכנרת וחזרה הביתה.</p>
        </div>
        <div className="daysGrid">
          {DAYS.map((day) => <DayCard key={day.day} day={day} />)}
        </div>
      </section>

      <section className="section split">
        <div>
          <p className="eyebrow">נקודות במסלול</p>
          <h2>נקודות עצירה וסימון חשובות</h2>
          <p>
            אלו נקודות המפתח מתוך ה־GPX והתכנון. שימו לב: נקודת מים שמסומנת בקובץ היא לא תחליף לבדיקה בשטח ובבוקר היציאה.
          </p>
        </div>
        <div className="waypointList">
          {WAYPOINTS.map((wp) => (
            <div className="waypoint" key={`${wp.km}-${wp.name}`}>
              <span className="kmBadge">ק״מ {wp.km}</span>
              <div>
                <h3>{wp.name}</h3>
                <p className="type">{wp.type}</p>
                <p>{wp.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="water">
        <div className="sectionHeader">
          <p className="eyebrow">מים</p>
          <h2>תוכנית מים מלאה</h2>
          <p>כלל ברזל: לא יוצאים מנקודת מים עם פחות מ־3 ליטר לאדם. ביום חם או בקבוצה איטית — 4 ליטר.</p>
        </div>

        <div className="tableCard">
          <table>
            <thead>
              <tr>
                <th>נקודה</th>
                <th>ק״מ מצטבר</th>
                <th>תפקיד</th>
              </tr>
            </thead>
            <tbody>
              {WATER_PLAN.map(([place, km, role]) => (
                <tr key={`${place}-${km}`}>
                  <td>{place}</td>
                  <td>{km}</td>
                  <td>{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section cards2" id="food">
        <Accordion title="תכנון אוכל" icon={Utensils} defaultOpen>
          <h3>עקרונות</h3>
          <ul>
            {FOOD.principles.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <h3>לכל אדם לשלושה ימים</h3>
          <ul>
            {FOOD.perPerson.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Accordion>

        <Accordion title="רשימת ציוד" icon={Backpack} defaultOpen>
          <h3>ציוד אישי</h3>
          <ul className="columns">
            {GEAR.personal.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <h3>ציוד קבוצתי</h3>
          <ul>
            {GEAR.group.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Accordion>
      </section>

      <section className="section cards2" id="safety">
        <Accordion title="נקודות החלטה בזמן אמת" icon={Clock} defaultOpen>
          <div className="decisionGrid">
            {DECISIONS.map((item) => (
              <div className="decision" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </Accordion>

        <Accordion title="תחבורה וחזרה הביתה" icon={Bus} defaultOpen>
          <h3>הלוך — שישי בבוקר</h3>
          <p>
            יציאה מפתח תקווה ב־06:00, הגעה לאזור נהריה/אכזיב, התארגנות קצרה ותחילת הליכה סביב 09:30–10:15.
            את השעות המדויקות לבדוק ערב לפני לפי כתובת המוצא שלכם.
          </p>
          <h3>חזור — ראשון</h3>
          <p>
            יעד סיום בכנרת / גינוסר: 13:30–14:30. יעד יציאה בתחבורה מגינוסר / טבריה: עד 15:30.
            יעד הגעה לפתח תקווה: עד 19:00.
          </p>
        </Accordion>
      </section>

      <section className="section finalBox">
        <Tent size={28} />
        <div>
          <h2>סיכום קצר לביצוע</h2>
          <p>
            שישי: אכזיב ← אבירים. שבת: אבירים ← פיתול מירון. ראשון: פיתול מירון ← נחל עמוד ← כנרת.
            התכנון אפשרי, אבל דורש יציאה מוקדמת, משמעת מים, משמעת זמן, ולינה רק בנקודות המותרות שתוכננו.
          </p>
        </div>
        <a className="primaryButton" href="#overview"><Home size={18} /> חזרה לראש הדף</a>
      </section>
    </main>
  );
}

export default App;
