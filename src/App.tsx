import { useMemo, useRef, useState } from "react";
import "./App.css";

type Person = {
  id: string;
  label: string;
  emoji: string;
  videoId: string;
  accent: string;
};

const twemojiMap: Record<string, string> = {
  "🌸": "1f338",
  "💀": "1f480",
  "❤️": "2764",
  "🐱": "1f431",
  "🎮": "1f3ae",
  "✨": "2728",
  "🎁": "1f381",
  "🎄": "1f384",
  "🎅": "1f385",
};

const scatterPool = ["🌸", "💀", "❤️", "🐱", "🎮", "✨", "🎁", "🎄", "🎅"];
const christmasPool = ["🎅", "🎄", "🎁"];

const getTwemojiUrl = (emoji: string) => `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${twemojiMap[emoji] ?? "2753"}.svg`;

const generateBackdropEmojis = (columns: number, rows: number) =>
  Array.from({ length: columns * rows }, (_, idx) => {
    const row = Math.floor(idx / columns);
    const col = idx % columns;
    const visible = (row + col) % 2 === 0;
    const emoji = scatterPool[Math.floor(Math.random() * scatterPool.length)];
    return { url: getTwemojiUrl(emoji), emoji, visible };
  });

const stripBracketedSections = (lyrics: string) =>
  lyrics
    .split("\n")
    .filter((line) => !/^\s*\[[^\]]*]\s*$/.test(line))
    .map((line) => line.replace(/\[[^\]]*]/g, "").trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();

const juusoLyrics = `[INTRO]
voimaa, nopeutta
Koikkari räjähtää

[VERSE 1]
Nimimerkki raimo vormisto
Telkkarissa pyörii jalkapallo
Mulletin suunta takaviisto
Vaimo sanoo että tule jo

[CHANT / HYPE SHOUT]
JOO JOO JOO

[VERSE 2]
Miehen on pakko olla paksua nahkaa
perheeseen kuuluu kolme kissaa
Päällä on vaan marimekkoo ja makiaa
Niitä oli myös joululahjalistal
Kulta voisitko tulla lisäämään niveaa


[VERSE 3]
Lukonmäessä miettii oispa kaljaa
anoppi sanoo että kaapista sitä saa
Poika kysyy saako kanavaa vaihtaa
chelsillä ois mahkuja tulla takaa
Mutta siellä taas omissa laulaa
miksen aikoinaan valinnut barsaa

[SCREAM / BUILD-UP]
KOHTA NAPSAHTAA

[VERSE 4]
Suklaakakku alkaa olla loppu
tytölläkin tuntuu olevan hoppu
Kotona kysyy saanko pelaa
haaveeksi kuitenkin tilanne kuivaa (juu ei!)
Aamulla vaimo junalle
illalla squadi tilalle

[DROP / HYPE CALL]
KYLLÄ LÄHTEE

[PRE-CHORUS / SPOKEN SYSTEM MESSAGE]
Raimo vormisto on kirjautunut sisään

[CHORUS / ANTHEM]
ohjaimet nousee laatikoistaan
raimo on vapautunut raudoistaan
on pelipäivä
on pelipäivä
on juuson vapaapäivä

[CHORUS / ANTHEM]
ohjaimet nousee laatikoistaan
raimo on vapautunut raudoistaan
on pelipäivä
on pelipäivä
on juuson vapaapäivä


[VERSE 5]
Pelit taas on pojilla tulilla
Konekivääri laulaa kuumana (ratatata)
Ilta vilahtaa sormien välistä
Aamulla taas on normipäivä (VOI VITTU)

[FINAL CHANT / OUTRO]
minä olen golffimies
minä kuulun a-ryhmään
minä olen pelimies
`;

const minnaLyrics = `[INTRO]
Otetaanko yhdet salmari shotit minnalle

[VERSE 1]
Minna
Ovesi aina on avoinna
Pitkä sinulla on pinna
Minulle olet keisarinna
Lukonmäen belladonna
Nähdessäsi huudan hoosianna
Et ole nunna, vaan nanna

[HOOK / REFRAIN]
Nannanaa nannaanaanaa MINNA

[CHORUS]
mökille aina saa tulla
odotan vuoroasi rummikubissa
menisin puolestasi vaikka linnaan
kukaan ei uskalla sulle vittuilla
taidan olla sinun sohvapaikalla
kanssasi on kivaa chillailla
haluan olla sinun puolella

[POST-CHORUS]
Mennään yhdessä verkolle

[VERSE 2]
Pelasin kanssasi lautapelin, yritin olla mielin kielin
Rakastan kanssasi humpsutella, sekä pulliasi mutustella
Yritän kerätä pisteitä, tavaillen samalla isämeitä
Laitathan kahviini ripauksen rakkautta,
Siitä kasvaa minun ulkomitta

[INTERLUDE / SPOKEN BREAK]
Saanko lainata paitaasi

[VERSE 3]
Pihassa on hieno volvo, kauniin äänen kuullessani repeää tärykalvo
Lähtisitkö kanssani lounaalle, muualle kuin kotosalle, ehkä pizzalle
Haluan olla klaaninne jäsen, toivon että myös näätsen
Ikämiestenkadulla on aina fiesta
Vaikea valita parhaita hetkiä kaiken sen seasta
Anoppi, lempimusiikki rokki eikä mikään homopoppi

[PRE-CHORUS / BUILD]
Sohvalla me maataan, nostetaan jalkatuet ilmaaaaan

[CHORUS]
Minna, mökille aina saa tulla
Minna, odotan vuoroasi rummikubissa
Minna, taidan olla sinun sohvapaikalla
Minna, haluan olla sinun puolella

[FINALE / SHOUT]
NYT KAIKKI NOSTAA JALKATUET ILMAAN
`;

const kariLyrics = `[INTRO]
Kari, tuo arjen sankari
Mies ei ole mikään runkkari
Päällä sporttiset verkkarit
Jalassa diadoran lenkkarit

[VERSE 1]
Padelverkolla seisoo kuin tolppa
Vartaloltaan mies kuin norppa
Liitää kentällä kuin tirppa
Eikä vaimo ole mikään kurppa

[CHANT / CALL-OUT]
MENNÄÄN JO KIRPPARILLE
Vamos vamos

[VERSE 2]
Lukonmäen skrodein talkkari
Reflekseiltä maalivahti
Linnakalliossa vakkari
Mieli kirkas kuin okkoliinin KRISTALLIIII

[riffing]

On sillä klaanin isoin telkkari
Päästävä pelaan tai hedari
On se melkoinen nikkari
Jolla on pystyssä aina keskari

[PRE-CHORUS / FLEX BUILD]
Naiset kuolaa kun luulevat näyttelijäksi
Niin hyvä hahmo että vois olla salkkaritähti

[CHORUS / HOOK]
Kari kari  karppaaa
Kari kari  karppaaa

[POST-CHORUS / CROWD CHANT]
Syö jätskiä suoraa purkista
Lexusmies joka ajaa skodalla
Smäshi kovempi kuin koellolla
Suonissa virtaa bitumia
Mies teflonia mutta sydän puhdasta timanttiaaaaaaa

[VERSE 3]
Se on syöttömestari
vaatteet kun ois festari
Alakierre motto
kengiks kelpaa vaan lotto
Kylmällä vihree neule pusero
muuten paidassa kukkaketo
Harmaa kettu
jolle maistuu uppopaistettu lintu

MEIDÄN KAIKKIEN LEMPPARI

[BREAK / CROWD SHOUT]
MENNÄÄN KIRPPARILLE
MENNÄÄN KIRPPARILLE
MENNÄÄN KIRPPARILLE

[OUTRO / FINAL SHOUT]
HARMAA KETTU JEAAA

SUPERI
`;

const babeLyrics = `Oi Jenni, pystyssä minulla on antenni
Sinua varten yritän olla gentlemanni
Lattialla meillä mönkii monni, pikkuruinen sonni
Minulla kävi hyvä onni

Uu beibi mamasita

Käyttäisitkö minuun lihapäiväsi
Taco, pizza tai dumplingsi, ihan sama haluan jämäsi
Taas heiluvat jats kädet, tiedän että nyt on selvät sävelet
Vuoksesi lähden paikkaan kaukaiseen, pakettisi on saapunut uuteen tilaukseen


On meillä tusina vuosia takana, en halua olla kaukana,
vaan vieläkin mukana, olet aivan ihana
Haluan sinua töötätä, tykkään takanasi pörrätä
Mietin mitä sanoisin, mielessä hymy ihanin
Tutustumisemme oli ehkä kohtalo, mietin vain että vau, mikä vartalo


Toin sinulle kukkia, alepasta arvatenkin
Ajatus on tärkein, sinussa se on kuitenkin
Olen elongeited aina kun nään sun pilates reidet
Kiiltävä timanttisi on ridikkulous, niin on myös meidän talous
Et luota kehenkään enempää kun siskoos, tunnen sen ja se on aika skitso

Na naa

Kohta tanssin kanssasi häävalssin, on meillä melkoinen romanssi
Olet maukas kuin muffinssi, minun ikioma missi
Oli helppo rakastua sinuun, haluan katsoa tämän loppuun
Heti jäin koukkuun, ja kävin sinun kimppuun
Saan jakaa elämäni kanssasi, olen huomenissakin vieressäsi
Olet minun rakkaus pakkaus, käviskö nopea heittolaukaus

Pum pum pum

Valollasi minut sokaiset, ennen kun kylkeeni potkaiset
Herätyksesi soi tunti sitten, vieläkin ollaan kolmisteen vieretysten
Pyydän että pidät etäpäivän, voin tehdä sinulle lounasleivän

Nam nam

Taas töissä sinulla on vastassa rikos, onneksi olet big boss
Päälläsi uusi puuvillamekko, palaverissa kestää virtsarakko
Netistä löytyy unikko ja peikko, onkohan lupaa, rikollisjoukko
Kohta soittaa dementikko, ja korvaasi tulee lentosuukko

Pus pus

Kampaajalta tuli taas polkkatukka, tässä sinulle välipalapatukka
Olit hakenut uudet hienot kynnet, samalla kun vetäsin nokkaunet
Mielessäsi olen varmaan nörtti, tää matka on ollu mulle wörtti
Muistathan varata minulle paikka viereesi pilatekseen

Love you beibe
`;

const lauraLyrics = `[female voice]
Laura, mikä uskomaton aura
Edessä mani piis, takana nuttura
Koodaa koneella, niskassa junttura
Joka tiistai meillä paras seura
Naamassa pisama, ei mikään auringonpolttama
Vähärasvainen nauta
Sormissa bling bling eikä mikään Oura

[female voice]
Kissoja, koruja, koodia
Kissoja, koruja, koodia

[male voice]
Tyttö on bängeri, aina sanavalmis kuin räppäri
Niin paljon biisejä, vois olla useammankin lämppäri
Timanttista kontsaa, olis hyvä temppari
Pähkinänsärkijä, klaanin ainoa melkein järkevä
Tunneälykäs, petonisäkäs
Ota pois filtteri, olet oikea trendi setteri
tsika tsikaa

[female voice]
Lauraa, et ole peruskauraa
Lauraa, kaikki sulle hurraa
Lauraa, kaikki vitseillesi nauraa
Lauraa, lisää vähän ruskettavaa

[female voice]
Kissoja, koruja, koodia

[female voice]
Kissoja, koruja, koodia

[male voice]
bailando mujer bella

[male voice]
Lempiruokasi mäti, ammattina ei todellakaan mikään kirjastotäti
Tunnet tietojärjestelmän, toin yllätys hedelmän
Tässä uusi lakana, et enää ärsytä minua sikana
Veit taas mun leikkihuoneen, vastineeksi saan tough lovee
Lasin pohjalle jäi limuu, aamulla tarvitaan taas luumu
Ihohoidon kävelevä tietopankki, säärissä lämmittää talviturkki
Keratiini botuliini rutiini, ihosi sileä kuin satiini

[male voice]
Olé Olé

[female voice]
Kissoja, koruja, koodia

[male voice]
Taas kuljet läpi bulevardin, päälläsi tietenkin leopardi
Kissanaisen standardi, vau mikä sharmi
Ei toista mahdu miljardiin, meille kaikille harmi
Sanot minulle että bastardi ja housuihini valuu laardi
Tuliko töissä hyvä torttu, kysyi alla mainittu
`;

const lyricsByPersonId: Partial<Record<Person["id"], string>> = {
  b: babeLyrics,
  j: juusoLyrics,
  k: kariLyrics,
  l: lauraLyrics,
  m: minnaLyrics,
};

const lyricsHeadingByPersonId: Partial<Record<Person["id"], string>> = {
  b: "Häävalssi",
  j: "Pelipäivä",
  k: "Syöttömestari",
  l: "Kissoja, koruja, koodia",
  m: "Nostetaan jalkatuet",
};

const getLyricsHeading = (person: Person) => lyricsHeadingByPersonId[person.id] ?? `${person.label} – sanat`;

type BurstItem = {
  id: string;
  emoji: string;
  x: number;
  delayMs: number;
  durationMs: number;
  driftPx: number;
  swayPx: number;
  swayDurationMs: number;
  rotateDeg: number;
  scale: number;
};

function App() {
  const gridColumns = 10;
  const gridRows = 14;
  const [backdropEmojis] = useState(() => generateBackdropEmojis(gridColumns, gridRows));
  const [lastSelectedEmoji, setLastSelectedEmoji] = useState<string | null>(null);
  const [revealedById, setRevealedById] = useState<Partial<Record<Person["id"], boolean>>>({});
  const [openingById, setOpeningById] = useState<Partial<Record<Person["id"], boolean>>>({});
  const [burstById, setBurstById] = useState<Partial<Record<Person["id"], BurstItem[]>>>({});
  const openingInFlightRef = useRef<Set<Person["id"]>>(new Set());
  const [lauraShakeToken, setLauraShakeToken] = useState(0);
  const [presentGameById, setPresentGameById] = useState<
    Partial<
      Record<
        Person["id"],
        {
          clicks: number;
          x: number;
          y: number;
          popToken: number;
        }
      >
    >
  >({});
  const people: Person[] = useMemo(
    () => [
      {
        id: "m",
        label: "Minna",
        emoji: "🌸",
        videoId: "ntS0HOixevI",
        accent: "#c69cff",
      },
      {
        id: "k",
        label: "Kari",
        emoji: "💀",
        videoId: "fCifCeyaEgc",
        accent: "#000000",
      },
      {
        id: "b",
        label: "Babe",
        emoji: "❤️",
        videoId: "Vf0Bwd6f6-g",
        accent: "#f13f60",
      },
      {
        id: "l",
        label: "Laura",
        emoji: "🐱",
        videoId: "msB0hvX1gZE",
        accent: "#4caf50",
      },
      {
        id: "j",
        label: "Juuso",
        emoji: "🎮",
        videoId: "EQA2a5ehu_Y",
        accent: "#3a8bff",
      },
    ],
    []
  );

  const [selected, setSelected] = useState<Person | null>(null);
  const selectedLyrics = selected ? lyricsByPersonId[selected.id] : null;
  const selectedHeading = selected ? getLyricsHeading(selected) : null;
  const isRevealed = selected ? Boolean(revealedById[selected.id]) : false;
  const isOpening = selected ? Boolean(openingById[selected.id]) : false;
  const lauraRequiredClicks = 5;
  const lauraGame = presentGameById.l ?? { clicks: 0, x: 50, y: 38, popToken: 0 };
  const lauraPresentEmoji = lauraGame.clicks >= lauraRequiredClicks - 1 ? "❤️" : lauraGame.clicks >= 2 ? "📦" : "🎁";

  const startOpenSequence = (personId: Person["id"]) => {
    if (openingInFlightRef.current.has(personId) || openingById[personId] || revealedById[personId]) return;
    openingInFlightRef.current.add(personId);

    const burstCount = 22;
    const now = Date.now();
    const burst: BurstItem[] = Array.from({ length: burstCount }, (_, idx) => {
      const emoji = christmasPool[Math.floor(Math.random() * christmasPool.length)];
      return {
        id: `${personId}-${now}-${idx}`,
        emoji,
        x: 6 + Math.random() * 88,
        delayMs: Math.floor(Math.random() * 900),
        durationMs: 3800 + Math.floor(Math.random() * 2200),
        driftPx: Math.floor(Math.random() * 120 - 60),
        swayPx: 18 + Math.floor(Math.random() * 42),
        swayDurationMs: 1600 + Math.floor(Math.random() * 1800),
        rotateDeg: Math.floor(Math.random() * 60 - 30),
        scale: 0.8 + Math.random() * 0.8,
      };
    });

    setBurstById((prev) => ({ ...prev, [personId]: burst }));
    setOpeningById((prev) => ({ ...prev, [personId]: true }));

    window.setTimeout(() => {
      setRevealedById((prev) => ({ ...prev, [personId]: true }));
      setOpeningById((prev) => ({ ...prev, [personId]: false }));
      window.setTimeout(() => {
        openingInFlightRef.current.delete(personId);
        setBurstById((prev) => ({ ...prev, [personId]: [] }));
      }, 1200);
    }, 4200);
  };

  const handleSelect = (person: Person) => {
    setLastSelectedEmoji(person.emoji);
    setSelected(person);
  };

  const handleBack = () => {
    setSelected(null);
  };

  return (
    <div className={`app${selected ? ` app-detail${isRevealed ? " app-revealed" : " app-locked"}` : " app-home"}`}>
      <div
        className={`hue-overlay${selected ? " hue-overlay-visible" : ""}`}
        style={
          {
            backgroundColor: selected?.accent ?? "#f8fafc",
            "--accent": selected?.accent ?? "#f8fafc",
          } as React.CSSProperties
        }
        aria-hidden="true"
      />

      <div className="bg-layer emoji-bg" aria-hidden="true">
        {backdropEmojis.map((item, idx) => (
          <div className={`emoji-cell${item.visible ? "" : " emoji-gap"}`} key={`${item.url}-${idx}`}>
            <img src={item.url} alt="" loading="lazy" className={`bg-emoji${selected && item.emoji !== selected?.emoji ? " slide-out" : ""}`} />
            {item.visible ? (
              <img
                src={getTwemojiUrl(lastSelectedEmoji ?? selected?.emoji ?? "❓")}
                alt=""
                loading="lazy"
                className={`bg-emoji selected-layer${selected ? " slide-in" : ""}`}
              />
            ) : null}
          </div>
        ))}
      </div>

      <div className="card-stack">
        <div className={`card ${selected ? "card-left" : "active"}`} aria-hidden={Boolean(selected)}>
          <header className="app-header">
            <div className="content">
              <p className="eyebrow">Mattilan Klaani</p>
              <h1>Hyvää joulua! 🎅</h1>
              <p>Tässä ovat joululahjanne, siis kaikki mitä saatte tänäjouluna.</p>
              <div className="button-container button-large">
                {people.map((person) => (
                  <button key={person.id} onClick={() => handleSelect(person)}>
                    <img className="icon-img" src={getTwemojiUrl(person.emoji)} alt="" aria-hidden="true" loading="lazy" />
                    {person.label}
                  </button>
                ))}
              </div>
            </div>
          </header>
        </div>

        <div className={`card ${selected ? "active" : "card-right"}`} aria-hidden={!selected}>
          <header className="app-header">
            {selected ? (
              <div className="detail content">
                <div className="detail-top">
                  <button className="ghost" onClick={handleBack}>
                    ← Takaisin
                  </button>
                  <div className="detail-title">
                    <img className="icon-img" src={getTwemojiUrl(selected.emoji)} alt="" aria-hidden="true" loading="lazy" />
                    <span>{selected.label}</span>
                  </div>
                </div>
                <div className={`reveal-stage${isRevealed ? " revealed" : ""}${isOpening ? " opening" : ""}`}>
                  <button
                    key={selected.id === "l" ? `l-${lauraShakeToken}` : selected.id}
                    type="button"
                    className={`present${selected.id === "l" && lauraShakeToken ? " shaking" : ""}${isOpening ? " opening" : ""}`}
                    disabled={isRevealed || isOpening}
                    aria-hidden={isRevealed}
                    tabIndex={isRevealed ? -1 : 0}
                    onClick={() => (selected.id === "l" ? setLauraShakeToken((token) => token + 1) : startOpenSequence(selected.id))}
                  >
                    {isOpening ? (
                      <span className="open-burst" aria-hidden="true">
                        {(burstById[selected.id] ?? []).map((item) => (
                          <span
                            key={item.id}
                            className="open-burst-item"
                            style={
                              {
                                "--x": `${item.x}%`,
                                "--delay": `${item.delayMs}ms`,
                                "--dur": `${item.durationMs}ms`,
                                "--dx": `${item.driftPx}px`,
                                "--sway": `${item.swayPx}px`,
                                "--swayDur": `${item.swayDurationMs}ms`,
                                "--rot": `${item.rotateDeg}deg`,
                                "--scale": item.scale,
                              } as React.CSSProperties
                            }
                          >
                            <img src={getTwemojiUrl(item.emoji)} alt="" />
                          </span>
                        ))}
                      </span>
                    ) : null}
                    {selected.id === "l" ? (
                      <span
                        className="present-emoji-slot moving clickable"
                        style={
                          {
                            "--present-x": `${lauraGame.x}%`,
                            "--present-y": `${lauraGame.y}%`,
                          } as React.CSSProperties
                        }
                        role="button"
                        tabIndex={0}
                        aria-label={`Klikkaa lahjaa (${lauraGame.clicks}/${lauraRequiredClicks})`}
                        onClick={(event) => {
                          if (isRevealed) return;
                          event.preventDefault();
                          event.stopPropagation();
                          const nextClicks = Math.min(lauraGame.clicks + 1, lauraRequiredClicks);
                          setPresentGameById((prev) => {
                            const current = prev.l ?? { clicks: 0, x: 50, y: 38, popToken: 0 };
                            const safeNextClicks = Math.max(nextClicks, Math.min(current.clicks + 1, lauraRequiredClicks));
                            const minDistance = 42;
                            let bestX = current.x;
                            let bestY = current.y;
                            let bestDistance = 0;

                            for (let attempt = 0; attempt < 14; attempt += 1) {
                              const candidateX = 6 + Math.random() * 88;
                              const candidateY = 6 + Math.random() * 88;
                              const dx = candidateX - current.x;
                              const dy = candidateY - current.y;
                              const distance = Math.hypot(dx, dy);

                              if (distance >= minDistance) {
                                bestX = candidateX;
                                bestY = candidateY;
                                bestDistance = distance;
                                break;
                              }

                              if (distance > bestDistance) {
                                bestDistance = distance;
                                bestX = candidateX;
                                bestY = candidateY;
                              }
                            }
                            return {
                              ...prev,
                              l: {
                                clicks: safeNextClicks,
                                x: bestX,
                                y: bestY,
                                popToken: current.popToken + 1,
                              },
                            };
                          });
                          if (nextClicks >= lauraRequiredClicks) {
                            startOpenSequence("l");
                          }
                        }}
                        onKeyDown={(event) => {
                          if (isRevealed) return;
                          if (event.key !== "Enter" && event.key !== " ") return;
                          event.preventDefault();
                          (event.currentTarget as HTMLSpanElement).click();
                        }}
                      >
                        <span className={`present-emoji${lauraGame.popToken > 0 ? " popping" : ""}`} aria-hidden="true" key={lauraGame.popToken}>
                          {lauraPresentEmoji}
                        </span>
                      </span>
                    ) : null}
                    <span className="present-inner">
                      {selected.id !== "l" ? (
                        <span className="present-emoji" aria-hidden="true">
                          🎁
                        </span>
                      ) : null}
                      <span className="present-title">Avaa lahja</span>
                      {isOpening ? <span className="present-subtitle">Aukeaa...</span> : null}
                    </span>
                  </button>
                  <div className="reveal-video" aria-hidden={!isRevealed}>
                    <div className="video-frame">
                      {isRevealed ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${selected.videoId}`}
                          title={`${selected.label} video`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className={`lyrics-wrap${isRevealed && selectedLyrics ? " visible" : ""}`} aria-hidden={!isRevealed || !selectedLyrics}>
                  {isRevealed && selectedLyrics ? (
                    <div className="lyrics-text" role="region" aria-label={`${selectedHeading ?? selected.label} biisin sanat`}>
                      <div className="lyrics-heading">{selectedHeading}</div>
                      <pre className="lyrics-body">{stripBracketedSections(selectedLyrics)}</pre>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </header>
        </div>
      </div>
    </div>
  );
}

export default App;
