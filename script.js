// ========================================
// BIJEN CONTROLE APP
// Volledige JavaScript-versie
// ========================================


// ========================================
// ALGEMENE INSTELLINGEN
// ========================================

let actiefSeizoen = 2026;
let actieveKastId = null;
let tijdelijkeKastFoto = null;
let tijdelijkeWeerMeting = null;
let vlieggebiedKaart = null;
let vlieggebiedMarker = null;
let vlieggebiedCirkels = {};
let laatsteAdresZoekTijd = 0;
let actieveHistorieIndex = null;

const opslagNaam = "bijenControleAppGegevens";


// ========================================
// STANDAARDGEGEVENS
// ========================================

const standaardBijenkasten = [
    {
        id: 1,
        naam: "Kast 1",
        locatie: "Achtertuin",
        latitude: null,
        longitude: null,
        foto: null,
        ramenPerBroedkamer: 11,

        status: "In orde",
        laatsteControle: "18 juli 2026",
        dagenGeleden: "6 dagen geleden",

        koningin: "Gezien",
        broed: "Goed patroon",
        voer: "Voldoende",
        varroa: "Geen bijzonderheden",
        ruimte: "Voldoende ruimte",

        ramenBezet: 9,
        ramenBrias: 7,
        broedkamers: 1,
        honingkamers: 1,

        volgendeActie:
            "Over één week opnieuw controleren",

        temperament: "Rustig",

        notities:
            "Mooi gesloten broednest. Koningin gezien. Voldoende voer aanwezig.",

        kasttype: "Spaarkast",
        koninginMarkering: "wit",
        herkomst: "Eigen aflegger",

        seizoenen: {
            2026: {
                honingGeoogst: true,
                honingRamenGeoogst: 6,
                apifondaZakken: 2,
                suikerwaterLiter: 8,

                laatsteVoeractie:
                    "10 juli 2026 - 1 zak Apifonda",

                laatsteBehandeling:
                    "Geen behandeling geregistreerd"
            }
        },

        historie: [
            {
                datum: "18 juli 2026",
                status: "In orde",
                notitie:
                    "Koningin gezien, 9 ramen bezet en 7 ramen BRIAS."
            }
        ]
    },

    {
        id: 2,
        naam: "Kast 2",
        locatie: "Achtertuin",
        latitude: null,
        longitude: null,
        foto: null,
        ramenPerBroedkamer: 10,

        status: "Aandacht",
        laatsteControle: "12 juli 2026",
        dagenGeleden: "12 dagen geleden",

        koningin: "Niet gezien",
        broed: "Onregelmatig",
        voer: "Laag",
        varroa: "Meting nodig",
        ruimte: "Nog voldoende",

        ramenBezet: 6,
        ramenBrias: 4,
        broedkamers: 1,
        honingkamers: 0,

        volgendeActie:
            "Binnen drie dagen koningin en voer controleren",

        temperament: "Wat onrustig",

        notities:
            "Koningin niet gezien. Wel eitjes aanwezig. Voervoorraad lijkt laag.",

        kasttype: "Spaarkast",
        koninginMarkering: "wit",
        herkomst: "Aangekocht volk",

        seizoenen: {
            2026: {
                honingGeoogst: false,
                honingRamenGeoogst: 0,
                apifondaZakken: 1,
                suikerwaterLiter: 5,

                laatsteVoeractie:
                    "12 juli 2026 - 5 liter suikerwater",

                laatsteBehandeling:
                    "Geen behandeling geregistreerd"
            }
        },

        historie: [
            {
                datum: "12 juli 2026",
                status: "Aandacht",
                notitie:
                    "Koningin niet gezien. 6 ramen bezet en 4 ramen BRIAS."
            }
        ]
    },

    {
        id: 3,
        naam: "Kast 3",
        locatie: "Weiland",
        latitude: null,
        longitude: null,
        foto: null,
        ramenPerBroedkamer: 11,

        status: "In orde",
        laatsteControle: "20 juli 2026",
        dagenGeleden: "4 dagen geleden",

        koningin: "Bewijs aanwezig",
        broed: "Goed patroon",
        voer: "Ruim voldoende",
        varroa: "Geen bijzonderheden",
        ruimte: "Honingkamer nodig",

        ramenBezet: 11,
        ramenBrias: 8,
        broedkamers: 1,
        honingkamers: 2,

        volgendeActie:
            "Extra honingkamer plaatsen",

        temperament: "Zeer rustig",

        notities:
            "Sterk volk met veel bijen. Binnenkort extra ruimte geven.",

        kasttype: "Dadant",
        koninginMarkering: "wit",
        herkomst: "Zwerm 2025",

        seizoenen: {
            2026: {
                honingGeoogst: true,
                honingRamenGeoogst: 11,
                apifondaZakken: 0,
                suikerwaterLiter: 0,

                laatsteVoeractie:
                    "Nog niet geregistreerd",

                laatsteBehandeling:
                    "15 juli 2026 - Varroameting uitgevoerd"
            }
        },

        historie: [
            {
                datum: "20 juli 2026",
                status: "In orde",
                notitie:
                    "11 ramen bezet, 8 ramen BRIAS en twee honingkamers."
            }
        ]
    }
];


// ========================================
// GEGEVENS LADEN
// ========================================

let bijenkasten = laadGegevens();

function laadGegevens() {
    try {
        const opgeslagenGegevens =
            localStorage.getItem(opslagNaam);

        console.log(
            "Opgeslagen gegevens gevonden:",
            Boolean(opgeslagenGegevens)
        );

        if (!opgeslagenGegevens) {
            return maakKopie(
                standaardBijenkasten
            );
        }

        const gegevens =
            JSON.parse(opgeslagenGegevens);

        if (!Array.isArray(gegevens)) {
            throw new Error(
                "De opgeslagen gegevens zijn geen geldige kastenlijst."
            );
        }

        gegevens.forEach((kast) => {
            if (!kast.ramenPerBroedkamer) {
                kast.ramenPerBroedkamer = 11;
            }

            kast.latitude = Number.isFinite(Number(kast.latitude))
                ? Number(kast.latitude)
                : null;

            kast.longitude = Number.isFinite(Number(kast.longitude))
                ? Number(kast.longitude)
                : null;

            if (!kast.temperamentScore) {
    kast.temperamentScore =
        maakTemperamentScore(
            kast.temperament
        );
}

            if (!kast.koninginMarkering) {
                const oudeKleur = String(
                    kast.koninginkleur || ""
                ).toLowerCase();

                const geldigeKleuren = [
                    "wit",
                    "geel",
                    "rood",
                    "groen",
                    "blauw"
                ];

                kast.koninginMarkering =
                    geldigeKleuren.includes(
                        oudeKleur
                    )
                        ? oudeKleur
                        : "niet-gemarkeerd";
            }

            if (!kast.seizoenen) {
                kast.seizoenen = {};
            }

            if (!Array.isArray(kast.historie)) {
                kast.historie = [];
            }

            kast.historie.forEach((controle) => {
                if (!controle.snapshot) {
                    controle.snapshot = null;
                }
            });

            if (!kast.volgendeControleDatum) {
                const advies =
                    berekenControleAdvies(kast);

                kast.volgendeControleDatum =
                    maakIsoDatum(
                        voegDagenToe(
                            new Date(),
                            advies.dagen
                        )
                    );

                kast.controleAdviesDagen =
                    advies.dagen;

                kast.controleAdviesReden =
                    advies.reden;

                kast.automatischControleAdvies =
                    true;
            }
        });

        return gegevens;
    } catch (fout) {
        console.error(
            "Laden van gegevens mislukt:",
            fout
        );

        alert(
            "De opgeslagen gegevens konden niet worden geladen. " +
            "De standaardkasten worden tijdelijk getoond. " +
            "Wis de browsergegevens nog niet."
        );

        return maakKopie(
            standaardBijenkasten
        );
    }
}

function bewaarGegevens() {
    try {
        const gegevensTekst =
            JSON.stringify(bijenkasten);

        localStorage.setItem(
            opslagNaam,
            gegevensTekst
        );

        console.log(
            "Gegevens opgeslagen:",
            Math.round(gegevensTekst.length / 1024),
            "KB"
        );

        return true;
    } catch (fout) {
        console.error(
            "Opslaan mislukt:",
            fout
        );

        if (
            fout.name === "QuotaExceededError" ||
            fout.name === "NS_ERROR_DOM_QUOTA_REACHED"
        ) {
            alert(
                "De browseropslag is vol. Waarschijnlijk is een kastfoto te groot. " +
                "Verwijder of verklein de foto en probeer opnieuw."
            );
        } else {
            alert(
                "De gegevens konden niet worden opgeslagen. " +
                "Open F12 → Console om de fout te bekijken."
            );
        }

        return false;
    }
}

function maakKopie(gegevens) {
    return JSON.parse(JSON.stringify(gegevens));
}



// ========================================
// ALGEMENE HULPFUNCTIES
// ========================================

function haalElementOp(id) {
    const element = document.getElementById(id);

    if (!element) {
        console.warn(
            `HTML-element niet gevonden: #${id}`
        );
    }

    return element;
}
function maakTemperamentTekst(score) {
    const waarde = Number(score);

    if (waarde === 1) {
        return "Zeer rustig";
    }

    if (waarde === 2) {
        return "Rustig";
    }

    if (waarde === 3) {
        return "Alert / normaal";
    }

    if (waarde === 4) {
        return "Prikkelbaar";
    }

    if (waarde === 5) {
        return "Erg aanvallend";
    }

    return "Onbekend";
}

function maakTemperamentScore(temperamentTekst) {
    const tekst = String(
        temperamentTekst || ""
    ).toLowerCase();

    if (tekst.includes("zeer rustig")) {
        return 1;
    }

    if (tekst.includes("rustig")) {
        return 2;
    }

    if (tekst.includes("alert")) {
        return 3;
    }

    if (tekst.includes("normaal")) {
        return 3;
    }

    if (tekst.includes("prikkelbaar")) {
        return 4;
    }

    if (tekst.includes("aanvallend")) {
        return 5;
    }

    return 2;
}

function werkTemperamentVoorbeeldBij() {
    const slider =
        haalElementOp("invoer-temperament");

    const voorbeeld =
        haalElementOp("temperament-voorbeeld");

    if (!slider || !voorbeeld) {
        return;
    }

    voorbeeld.textContent =
        maakTemperamentTekst(slider.value);
}

function zetTekst(id, tekst) {
    const element = haalElementOp(id);

    if (element) {
        element.textContent =
            tekst === undefined ||
            tekst === null ||
            tekst === ""
                ? "-"
                : tekst;
    }
}

function toonScherm(id) {
    const element = haalElementOp(id);

    if (element) {
        element.classList.remove("hidden");
    }
}

function verbergScherm(id) {
    const element = haalElementOp(id);

    if (element) {
        element.classList.add("hidden");
    }
}

function haalActieveKastOp() {
    return bijenkasten.find(
        (kast) => kast.id === actieveKastId
    );
}

function bepaalStatusClass(status) {
    if (status === "Aandacht") {
        return "status-aandacht";
    }

    if (status === "Probleem") {
        return "status-probleem";
    }

    return "status-goed";
}

function haalSeizoensgegevensOp(kast) {
    if (!kast.seizoenen) {
        kast.seizoenen = {};
    }

    if (!kast.seizoenen[actiefSeizoen]) {
        kast.seizoenen[actiefSeizoen] = {
            honingGeoogst: false,
            honingRamenGeoogst: 0,
            apifondaZakken: 0,
            suikerwaterLiter: 0,
            laatsteVoeractie:
                "Nog niet geregistreerd",
            laatsteBehandeling:
                "Geen behandeling geregistreerd"
        };
    }

    return kast.seizoenen[actiefSeizoen];
}

function maakDatumTekst() {
    return new Intl.DateTimeFormat(
        "nl-NL",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(new Date());
}
function maakIsoDatum(datum) {
    const jaar = datum.getFullYear();

    const maand = String(
        datum.getMonth() + 1
    ).padStart(2, "0");

    const dag = String(
        datum.getDate()
    ).padStart(2, "0");

    return `${jaar}-${maand}-${dag}`;
}

function voegDagenToe(datum, aantalDagen) {
    const nieuweDatum = new Date(datum);

    nieuweDatum.setDate(
        nieuweDatum.getDate() + aantalDagen
    );

    return nieuweDatum;
}

function formatteerIsoDatum(isoDatum) {
    if (!isoDatum) {
        return "Nog niet bepaald";
    }

    const onderdelen = isoDatum.split("-");

    if (onderdelen.length !== 3) {
        return "Nog niet bepaald";
    }

    const datum = new Date(
        Number(onderdelen[0]),
        Number(onderdelen[1]) - 1,
        Number(onderdelen[2])
    );

    return new Intl.DateTimeFormat(
        "nl-NL",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(datum);
}

function berekenControleAdvies(kast) {
    const maand = new Date().getMonth() + 1;

    let dagen;
    let reden;

    if (maand === 3 || maand === 4) {
        dagen = 10;
        reden = "Voorjaarscontrole";
    } else if (maand === 5 || maand === 6) {
        dagen = 7;
        reden = "Snelle ontwikkeling en zwermperiode";
    } else if (maand === 7 || maand === 8) {
        dagen = 9;
        reden = "Actief zomerseizoen";
    } else if (maand === 9 || maand === 10) {
        dagen = 18;
        reden = "Rustigere herfstperiode";
    } else {
        dagen = 30;
        reden =
            "Winterperiode: alleen buitenzijde, gewicht en vliegopening controleren";
    }

    function verkortAdvies(
        nieuwAantalDagen,
        nieuweReden
    ) {
        if (nieuwAantalDagen < dagen) {
            dagen = nieuwAantalDagen;
            reden = nieuweReden;
        }
    }

    if (kast.ruimte === "Extra ruimte nodig") {
        verkortAdvies(
            3,
            "De kast heeft extra ruimte nodig"
        );
    }

    if (kast.ruimte === "Bijna vol") {
        verkortAdvies(
            5,
            "De beschikbare ruimte raakt op"
        );
    }

    if (kast.koningin === "Geen bewijs") {
        verkortAdvies(
            3,
            "Geen koningin, eitjes of jong broed gevonden"
        );
    }

    if (kast.voer === "Bijvoeren nodig") {
        verkortAdvies(
            3,
            "Bijvoeren is nodig"
        );
    }

    if (kast.voer === "Laag") {
        verkortAdvies(
            5,
            "De voervoorraad is laag"
        );
    }

    if (kast.varroa === "Behandeling nodig") {
        verkortAdvies(
            3,
            "Een varroabehandeling is nodig"
        );
    }

    if (kast.varroa === "Meting nodig") {
        verkortAdvies(
            5,
            "Een varroameting is nodig"
        );
    }

    if (kast.broed === "Onregelmatig") {
        verkortAdvies(
            5,
            "Het broedpatroon is onregelmatig"
        );
    }

    if (kast.broed === "Geen broed") {
        verkortAdvies(
            3,
            "Er is geen broed gevonden"
        );
    }

    return {
        dagen: dagen,
        reden: reden
    };
}

function maakControleTermijnTekst(isoDatum) {
    if (!isoDatum) {
        return "Nog geen controle gepland";
    }

    const onderdelen = isoDatum.split("-");

    const controleDatum = new Date(
        Number(onderdelen[0]),
        Number(onderdelen[1]) - 1,
        Number(onderdelen[2])
    );

    const vandaag = new Date();

    vandaag.setHours(0, 0, 0, 0);
    controleDatum.setHours(0, 0, 0, 0);

    const verschil = Math.round(
        (
            controleDatum.getTime() -
            vandaag.getTime()
        ) /
        (1000 * 60 * 60 * 24)
    );

    if (verschil === 0) {
        return "Vandaag controleren";
    }

    if (verschil === 1) {
        return "Morgen controleren";
    }

    if (verschil > 1) {
        return `Over ${verschil} dagen controleren`;
    }

    if (verschil === -1) {
        return "Controle is 1 dag te laat";
    }

    return `Controle is ${Math.abs(verschil)} dagen te laat`;
}
function leesNederlandseDatum(datumTekst) {
    if (
        !datumTekst ||
        datumTekst === "Nog niet gecontroleerd"
    ) {
        return null;
    }

    const maanden = {
        januari: 0,
        februari: 1,
        maart: 2,
        april: 3,
        mei: 4,
        juni: 5,
        juli: 6,
        augustus: 7,
        september: 8,
        oktober: 9,
        november: 10,
        december: 11
    };

    const onderdelen = datumTekst
        .toLowerCase()
        .trim()
        .split(/\s+/);

    if (onderdelen.length !== 3) {
        return null;
    }

    const dag = Number(onderdelen[0]);
    const maand = maanden[onderdelen[1]];
    const jaar = Number(onderdelen[2]);

    if (
        !Number.isFinite(dag) ||
        maand === undefined ||
        !Number.isFinite(jaar)
    ) {
        return null;
    }

    return new Date(jaar, maand, dag);
}

function berekenDagenGeleden(datumTekst) {
    const controleDatum =
        leesNederlandseDatum(datumTekst);

    if (!controleDatum) {
        return "-";
    }

    const vandaag = new Date();

    vandaag.setHours(0, 0, 0, 0);
    controleDatum.setHours(0, 0, 0, 0);

    const verschilInMilliseconden =
        vandaag.getTime() -
        controleDatum.getTime();

    const verschilInDagen = Math.floor(
        verschilInMilliseconden /
        (1000 * 60 * 60 * 24)
    );

    if (verschilInDagen <= 0) {
        return "Vandaag";
    }

    if (verschilInDagen === 1) {
        return "Gisteren";
    }

    return `${verschilInDagen} dagen geleden`;
}

function maakVeiligeTekst(tekst) {
    const tijdelijkElement =
        document.createElement("div");

    tijdelijkElement.textContent =
        tekst ?? "";

    return tijdelijkElement.innerHTML;
}
function bepaalKoninginJaarOpKleur(kleur) {
    const huidigJaar = new Date().getFullYear();

    const eindcijfersPerKleur = {
        wit: [1, 6],
        geel: [2, 7],
        rood: [3, 8],
        groen: [4, 9],
        blauw: [0, 5]
    };

    const toegestaneEindcijfers =
        eindcijfersPerKleur[kleur];

    if (!toegestaneEindcijfers) {
        return null;
    }

    /*
     * We zoeken vanaf het huidige jaar terug.
     * Zes jaar is ruim voldoende omdat de kleurcyclus
     * iedere vijf jaar opnieuw begint.
     */
    for (
        let jaar = huidigJaar;
        jaar >= huidigJaar - 6;
        jaar--
    ) {
        const laatsteCijfer = jaar % 10;

        if (
            toegestaneEindcijfers.includes(
                laatsteCijfer
            )
        ) {
            return jaar;
        }
    }

    return null;
}

function maakKoninginMarkeringTekst(kleur) {
    if (
        !kleur ||
        kleur === "niet-gemarkeerd"
    ) {
        return "Niet gemarkeerd";
    }

    const jaar =
        bepaalKoninginJaarOpKleur(kleur);

    const kleurMetHoofdletter =
        kleur.charAt(0).toUpperCase() +
        kleur.slice(1);

    if (!jaar) {
        return `${kleurMetHoofdletter} gemarkeerd`;
    }

    return `${kleurMetHoofdletter} gemarkeerd (${jaar})`;
}

// ========================================
// HOMEPAGINA EN KASTENOVERZICHT
// ========================================

function verplaatsKast(kastId, richting) {
    const huidigeIndex =
        bijenkasten.findIndex(
            (kast) => kast.id === kastId
        );

    if (huidigeIndex === -1) {
        return;
    }

    const nieuweIndex =
        huidigeIndex + richting;

    if (
        nieuweIndex < 0 ||
        nieuweIndex >= bijenkasten.length
    ) {
        return;
    }

    const tijdelijkeKast =
        bijenkasten[huidigeIndex];

    bijenkasten[huidigeIndex] =
        bijenkasten[nieuweIndex];

    bijenkasten[nieuweIndex] =
        tijdelijkeKast;

    bewaarGegevens();
    toonKastenOverzicht();
}

function toonKastenOverzicht() {
    const kastenLijst =
        haalElementOp("kasten-lijst");

    if (!kastenLijst) {
        return;
    }

    kastenLijst.innerHTML = "";

    bijenkasten.forEach((kast) => {
const kaart =
    document.createElement("article");

kaart.className = "kast-keuzekaart";
kaart.tabIndex = 0;
kaart.setAttribute("role", "button");

        kaart.setAttribute(
            "aria-label",
            `Open ${kast.naam} op locatie ${kast.locatie}`
        );

        const fotoHtml = kast.foto
            ? `
                <img
                    src="${kast.foto}"
                    alt="Foto van ${maakVeiligeTekst(kast.naam)}"
                >
            `
            : `
                <div class="kast-kaart-foto-placeholder">
                    🐝
                </div>
            `;

        kaart.innerHTML = `
            <div class="kast-keuzekaart-boven">

                <div class="kast-kaart-inhoud">

                    <div class="kast-kaart-foto">
                        ${fotoHtml}
                    </div>

                    <div class="kast-kaart-tekst">

                        <h3>
                            ${maakVeiligeTekst(kast.naam)}
                        </h3>

                        <p class="kast-keuzekaart-locatie">
                            📍 ${maakVeiligeTekst(kast.locatie)}
                        </p>

                    </div>

                </div>

                <span class="status-badge ${bepaalStatusClass(kast.status)}">
                    ${maakVeiligeTekst(kast.status)}
                </span>

            </div>
<div class="kast-keuzekaart-onder">

    <span class="laatste-controle-klein">
        Laatste controle:
        ${maakVeiligeTekst(kast.laatsteControle)}
    </span>

    <div class="kast-kaart-acties">

        <button
            type="button"
            class="volgorde-knop kast-omhoog"
            aria-label="${maakVeiligeTekst(kast.naam)} omhoog verplaatsen"
        >
            ↑
        </button>

        <button
            type="button"
            class="volgorde-knop kast-omlaag"
            aria-label="${maakVeiligeTekst(kast.naam)} omlaag verplaatsen"
        >
            ↓
        </button>

        <span class="kaart-pijl">
            ›
        </span>

    </div>

</div>
        `;

const omhoogKnop =
    kaart.querySelector(".kast-omhoog");

const omlaagKnop =
    kaart.querySelector(".kast-omlaag");

if (omhoogKnop) {
    omhoogKnop.addEventListener(
        "click",
        function (event) {
            event.stopPropagation();

            verplaatsKast(
                kast.id,
                -1
            );
        }
    );
}

if (omlaagKnop) {
    omlaagKnop.addEventListener(
        "click",
        function (event) {
            event.stopPropagation();

            verplaatsKast(
                kast.id,
                1
            );
        }
    );
}

kaart.addEventListener(
    "click",
    function () {
        openKast(kast.id);
    }
);

kaart.addEventListener(
    "keydown",
    function (event) {
        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();
            openKast(kast.id);
        }
    }
);

        kastenLijst.appendChild(kaart);
    });
}


// ========================================
// KASTDETAIL OPENEN
// ========================================

function openKast(kastId) {
    actieveKastId = Number(kastId);

    const kast = haalActieveKastOp();

    if (!kast) {
        alert(
            "De gekozen bijenkast kon niet worden gevonden."
        );

        return;
    }

    vulKastdetail(kast);

    verbergScherm("kasten-overzicht");
    verbergScherm("controle-formulier-scherm");
    verbergScherm("kast-kaart-scherm");
    verbergScherm("historische-controle-scherm");
    toonScherm("kast-detail");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function vulKastdetail(kast) {
    const seizoen =
        haalSeizoensgegevensOp(kast);

    zetTekst("detail-naam", kast.naam);
    zetTekst("detail-locatie", kast.locatie);
    zetTekst(
        "detail-laatste-controle",
        kast.laatsteControle
    );
    zetTekst(
    "detail-dagen-geleden",
    berekenDagenGeleden(
        kast.laatsteControle
    )
);

    zetTekst("detail-seizoen", actiefSeizoen);
    zetTekst("acties-seizoen", actiefSeizoen);

    zetTekst("detail-koningin", kast.koningin);
    zetTekst("detail-broed", kast.broed);
    zetTekst("detail-voer", kast.voer);
    zetTekst("detail-varroa", kast.varroa);
    zetTekst("detail-ruimte", kast.ruimte);

    zetTekst(
        "detail-ramen-bezet",
        kast.ramenBezet
    );

    zetTekst(
        "detail-ramen-brias",
        kast.ramenBrias
    );

    zetTekst(
        "detail-broedkamers",
        kast.broedkamers
    );

    zetTekst(
        "detail-honingkamers",
        kast.honingkamers
    );

zetTekst(
    "detail-volgende-actie",
    maakControleTermijnTekst(
        kast.volgendeControleDatum
    )
);

    zetTekst(
    "detail-controle-reden",
    kast.controleAdviesReden ||
        "Geen reden geregistreerd"
);

    zetTekst(
        "controle-datum",
        kast.laatsteControle
    );

    zetTekst(
    "controle-temperament",
    kast.temperamentScore
        ? maakTemperamentTekst(
            kast.temperamentScore
        )
        : kast.temperament
);

    zetTekst(
        "controle-notities",
        kast.notities
    );

    zetTekst(
        "detail-kasttype",
        kast.kasttype
    );

    zetTekst(
    "detail-koningin-markering",
    maakKoninginMarkeringTekst(
        kast.koninginMarkering
    )
    );

    zetTekst(
        "detail-herkomst",
        kast.herkomst
    );

    zetTekst(
        "detail-honing-oogst",
        seizoen.honingGeoogst
            ? "Ja"
            : "Nog niet"
    );
    zetTekst(
    "detail-ramen-bezet",
    kast.ramenBezet
);

zetTekst(
    "detail-ramen-brias",
    kast.ramenBrias
);

zetTekst(
    "detail-aantal-ramen-bezet",
    kast.ramenPerBroedkamer || 11
);

zetTekst(
    "detail-aantal-ramen-brias",
    kast.ramenPerBroedkamer || 11
);

zetTekst(
    "detail-broedkamers",
    kast.broedkamers
);

    const aantalOogstramen =
        seizoen.honingRamenGeoogst || 0;

    const ramenTekst =
        aantalOogstramen === 1
            ? "1 raam dit seizoen"
            : `${aantalOogstramen} ramen dit seizoen`;

    zetTekst(
        "detail-oogst-ramen",
        ramenTekst
    );

    zetTekst(
        "detail-apifonda",
        seizoen.apifondaZakken || 0
    );

    zetTekst(
        "detail-suikerwater",
        seizoen.suikerwaterLiter || 0
    );

    zetTekst(
        "actie-honing-geoogst",
        seizoen.honingGeoogst
            ? "Ja"
            : "Nee"
    );

    zetTekst(
        "actie-oogst-ramen",
        aantalOogstramen
    );

    zetTekst(
        "actie-laatste-voer",
        seizoen.laatsteVoeractie
    );

    zetTekst(
        "actie-laatste-behandeling",
        seizoen.laatsteBehandeling
    );

    const statusElement =
        haalElementOp("detail-status");

    if (statusElement) {
        statusElement.textContent =
            kast.status;

        statusElement.className =
            `status-badge ${bepaalStatusClass(kast.status)}`;
    }

    toonHistorie(kast.historie);
}


// ========================================
// KAART EN VLIEGGEBIED
// ========================================

function heeftExacteLocatie(kast) {
    return Boolean(
        kast &&
        Number.isFinite(Number(kast.latitude)) &&
        Number.isFinite(Number(kast.longitude))
    );
}

function maakVlieggebiedKaart() {
    if (vlieggebiedKaart || typeof L === "undefined") {
        return;
    }

    vlieggebiedKaart = L.map("vlieggebied-kaart");

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    ).addTo(vlieggebiedKaart);
}

function werkKaartCirkelsBij() {
    if (!vlieggebiedKaart) {
        return;
    }

    [1, 3, 5].forEach((afstand) => {
        const checkbox = haalElementOp(`kaart-cirkel-${afstand}`);
        const cirkel = vlieggebiedCirkels[afstand];

        if (!checkbox || !cirkel) {
            return;
        }

        if (checkbox.checked) {
            if (!vlieggebiedKaart.hasLayer(cirkel)) {
                cirkel.addTo(vlieggebiedKaart);
            }
        } else if (vlieggebiedKaart.hasLayer(cirkel)) {
            cirkel.remove();
        }
    });
}

function tekenVlieggebied(kast) {
    maakVlieggebiedKaart();

    if (!vlieggebiedKaart) {
        alert("De kaart kon niet worden geladen. Controleer je internetverbinding.");
        return;
    }

    const middelpunt = [Number(kast.latitude), Number(kast.longitude)];

    Object.values(vlieggebiedCirkels).forEach((cirkel) => cirkel.remove());
    vlieggebiedCirkels = {};

    if (vlieggebiedMarker) {
        vlieggebiedMarker.remove();
    }

    vlieggebiedMarker = L.marker(middelpunt)
        .addTo(vlieggebiedKaart)
        .bindPopup(`<strong>${maakVeiligeTekst(kast.naam)}</strong><br>${maakVeiligeTekst(kast.locatie)}`);

    vlieggebiedCirkels[1] = L.circle(middelpunt, {radius: 1000, color: "#47744c", weight: 2, fillColor: "#47744c", fillOpacity: 0.12});
    vlieggebiedCirkels[3] = L.circle(middelpunt, {radius: 3000, color: "#a96800", weight: 2, fillColor: "#f4bd3f", fillOpacity: 0.08});
    vlieggebiedCirkels[5] = L.circle(middelpunt, {radius: 5000, color: "#a43f39", weight: 2, fillColor: "#a43f39", fillOpacity: 0.04});

    werkKaartCirkelsBij();
    vlieggebiedKaart.setView(middelpunt, 12);

    window.setTimeout(() => vlieggebiedKaart.invalidateSize(), 100);
}

function openKastKaart() {
    const kast = haalActieveKastOp();

    if (!kast) {
        return;
    }

    if (!heeftExacteLocatie(kast)) {
        alert("Voor deze kast is nog geen exacte standplaats ingesteld. Vul de coördinaten in via Instellingen.");
        return;
    }

    zetTekst("kaart-kastnaam", kast.naam);
    zetTekst("kaart-locatienaam", kast.locatie);

    verbergScherm("kast-detail");
    verbergScherm("controle-formulier-scherm");
    toonScherm("kast-kaart-scherm");

    tekenVlieggebied(kast);
    toonDrachtKalender();
    window.scrollTo({top: 0, behavior: "smooth"});
}

function sluitKastKaart() {
    verbergScherm("kast-kaart-scherm");
    if (actieveKastId !== null) {
        toonScherm("kast-detail");
    }
}
async function zoekAdresLocatie() {
    const adresInvoer =
        haalElementOp(
            "instellingen-zoekadres"
        );

    const status =
        haalElementOp(
            "locatie-status"
        );

    const zoekKnop =
        haalElementOp(
            "adres-zoeken-knop"
        );

    if (!adresInvoer || !status) {
        return;
    }

    const zoekAdres =
        adresInvoer.value.trim();

    if (!zoekAdres) {
        status.textContent =
            "Vul eerst een adres, postcode of plaats in.";

        adresInvoer.focus();
        return;
    }

    const huidigeTijd = Date.now();

    if (
        huidigeTijd -
        laatsteAdresZoekTijd <
        1000
    ) {
        status.textContent =
            "Wacht één seconde en probeer opnieuw.";

        return;
    }

    laatsteAdresZoekTijd =
        huidigeTijd;

    const cacheSleutel =
        "adresCache:" +
        zoekAdres.toLowerCase();

    try {
        const opgeslagenResultaat =
            localStorage.getItem(
                cacheSleutel
            );

        if (opgeslagenResultaat) {
            const resultaat =
                JSON.parse(
                    opgeslagenResultaat
                );

            verwerkGevondenAdres(
                resultaat
            );

            return;
        }
    } catch (fout) {
        console.warn(
            "Adrescache kon niet worden gelezen:",
            fout
        );
    }

    status.textContent =
        "Locatie wordt gezocht...";

    if (zoekKnop) {
        zoekKnop.disabled = true;
        zoekKnop.textContent =
            "Bezig met zoeken...";
    }

    try {
        const parameters =
            new URLSearchParams({
                q: zoekAdres,
                format: "jsonv2",
                limit: "1",
                addressdetails: "1",
                "accept-language": "nl"
            });

        const antwoord =
            await fetch(
                "https://nominatim.openstreetmap.org/search?" +
                parameters.toString(),
                {
                    headers: {
                        Accept:
                            "application/json"
                    }
                }
            );

        if (!antwoord.ok) {
            throw new Error(
                `Adres zoeken gaf foutcode ${antwoord.status}`
            );
        }

        const resultaten =
            await antwoord.json();

        if (
            !Array.isArray(resultaten) ||
            resultaten.length === 0
        ) {
            status.textContent =
                "Geen locatie gevonden. Voeg een straat, postcode en plaats toe.";

            return;
        }

        const resultaat =
            resultaten[0];

        try {
            localStorage.setItem(
                cacheSleutel,
                JSON.stringify(
                    resultaat
                )
            );
        } catch (fout) {
            console.warn(
                "Adresresultaat kon niet worden bewaard:",
                fout
            );
        }

        verwerkGevondenAdres(
            resultaat
        );
    } catch (fout) {
        console.error(
            "Adres zoeken mislukt:",
            fout
        );

        status.textContent =
            "Het adres kon niet worden opgezocht. Controleer je internetverbinding.";
    } finally {
        if (zoekKnop) {
            zoekKnop.disabled = false;
            zoekKnop.textContent =
                "🔎 Locatie zoeken";
        }
    }
}

function verwerkGevondenAdres(resultaat) {
    const latitude =
        Number(resultaat.lat);

    const longitude =
        Number(resultaat.lon);

    const status =
        haalElementOp(
            "locatie-status"
        );

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        if (status) {
            status.textContent =
                "De gevonden locatie bevat geen geldige coördinaten.";
        }

        return;
    }

    stelInvoerWaardeIn(
        "instellingen-latitude",
        latitude.toFixed(6)
    );

    stelInvoerWaardeIn(
        "instellingen-longitude",
        longitude.toFixed(6)
    );

    if (status) {
        status.textContent =
            "Gevonden: " +
            resultaat.display_name;
    }
}

function gebruikHuidigeLocatie() {
    const status = haalElementOp("locatie-status");

    if (!navigator.geolocation) {
        if (status) status.textContent = "Deze browser ondersteunt geen locatiebepaling.";
        return;
    }

    if (status) status.textContent = "Locatie wordt opgehaald...";

    navigator.geolocation.getCurrentPosition(
        function (positie) {
            stelInvoerWaardeIn("instellingen-latitude", positie.coords.latitude.toFixed(6));
            stelInvoerWaardeIn("instellingen-longitude", positie.coords.longitude.toFixed(6));
            if (status) status.textContent = "Exacte standplaats ingevuld via GPS.";
        },
        function (fout) {
            console.error("Locatie ophalen mislukt:", fout);
            if (status) status.textContent = "Locatie kon niet worden opgehaald. Vul de coördinaten handmatig in.";
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 0}
    );
}
// ========================================
// DRACHTKALENDER
// ========================================

const drachtPlanten = [
    {naam: "Hazelaar", icoon: "🌼", start: 1, einde: 3},
    {naam: "Krokus", icoon: "🌷", start: 2, einde: 3},
    {naam: "Wilg", icoon: "🌿", start: 3, einde: 4},
    {naam: "Paardenbloem", icoon: "🌼", start: 3, einde: 5},
    {naam: "Fruitbloesem", icoon: "🌸", start: 4, einde: 5},
    {naam: "Koolzaad", icoon: "💛", start: 4, einde: 6},
    {naam: "Meidoorn", icoon: "🌸", start: 5, einde: 6},
    {naam: "Robinia / acacia", icoon: "🤍", start: 5, einde: 6},
    {naam: "Braam", icoon: "🌿", start: 5, einde: 7},
    {naam: "Linde", icoon: "🌳", start: 6, einde: 7},
    {naam: "Witte klaver", icoon: "☘️", start: 5, einde: 9},
    {naam: "Struikheide", icoon: "🪻", start: 7, einde: 9},
    {naam: "Klimop", icoon: "🍃", start: 9, einde: 11}
];

function bepaalDrachtStatus(plant, maand) {
    if (maand >= plant.start && maand <= plant.einde) {
        return {
            status: "Waarschijnlijk in bloei",
            klasse: "dracht-actief"
        };
    }

    if (maand === plant.start - 1) {
        return {
            status: "Begint mogelijk binnenkort",
            klasse: "dracht-binnenkort"
        };
    }

    if (maand === plant.einde + 1) {
        return {
            status: "Waarschijnlijk net afgelopen",
            klasse: "dracht-afgelopen"
        };
    }

    return null;
}

function maakMaandNaam(maand) {
    return new Intl.DateTimeFormat(
        "nl-NL",
        {month: "long"}
    ).format(new Date(2026, maand - 1, 1));
}

function maakBloeiperiodeTekst(plant) {
    const startNaam = maakMaandNaam(plant.start);
    const eindeNaam = maakMaandNaam(plant.einde);

    return plant.start === plant.einde
        ? startNaam
        : `${startNaam}–${eindeNaam}`;
}

function toonDrachtKalender() {
    const lijst = haalElementOp("dracht-lijst");
    const badge = haalElementOp("dracht-maand-badge");

    if (!lijst) {
        return;
    }

    const maand = new Date().getMonth() + 1;

    if (badge) {
        badge.textContent = maakMaandNaam(maand);
    }

    const zichtbarePlanten = drachtPlanten
        .map((plant) => ({
            plant,
            informatie: bepaalDrachtStatus(plant, maand)
        }))
        .filter((item) => item.informatie);

    lijst.innerHTML = "";

    if (zichtbarePlanten.length === 0) {
        lijst.innerHTML = `
            <p class="lege-melding">
                Voor deze maand staan geen hoofd-drachtplanten in de kalender.
            </p>
        `;
        return;
    }

    zichtbarePlanten.forEach(({plant, informatie}) => {
        const kaart = document.createElement("article");
        kaart.className = "dracht-kaart";
        kaart.innerHTML = `
            <div class="dracht-icoon">${plant.icoon}</div>
            <div class="dracht-inhoud">
                <strong>${maakVeiligeTekst(plant.naam)}</strong>
                <span class="dracht-status ${informatie.klasse}">
                    ${maakVeiligeTekst(informatie.status)}
                </span>
                <small>
                    Normale bloei: ${maakVeiligeTekst(maakBloeiperiodeTekst(plant))}
                </small>
            </div>
        `;
        lijst.appendChild(kaart);
    });
}

// ========================================
// WEER TIJDENS CONTROLE
// ========================================

function maakWeerInformatie(weatherCode) {
    const code = Number(weatherCode);

    if (code === 0) {
        return {
            icoon: "☀️",
            tekst: "Onbewolkt"
        };
    }

    if (code === 1) {
        return {
            icoon: "🌤️",
            tekst: "Overwegend helder"
        };
    }

    if (code === 2) {
        return {
            icoon: "⛅",
            tekst: "Half bewolkt"
        };
    }

    if (code === 3) {
        return {
            icoon: "☁️",
            tekst: "Bewolkt"
        };
    }

    if (code === 45 || code === 48) {
        return {
            icoon: "🌫️",
            tekst: "Mistig"
        };
    }

    if (
        code === 51 ||
        code === 53 ||
        code === 55
    ) {
        return {
            icoon: "🌦️",
            tekst: "Motregen"
        };
    }

    if (
        code === 56 ||
        code === 57
    ) {
        return {
            icoon: "🌧️",
            tekst: "IJzelende motregen"
        };
    }

    if (
        code === 61 ||
        code === 63 ||
        code === 65
    ) {
        return {
            icoon: "🌧️",
            tekst: "Regen"
        };
    }

    if (
        code === 66 ||
        code === 67
    ) {
        return {
            icoon: "🌧️",
            tekst: "IJzelende regen"
        };
    }

    if (
        code === 71 ||
        code === 73 ||
        code === 75 ||
        code === 77
    ) {
        return {
            icoon: "🌨️",
            tekst: "Sneeuw"
        };
    }

    if (
        code === 80 ||
        code === 81 ||
        code === 82
    ) {
        return {
            icoon: "🌦️",
            tekst: "Regenbuien"
        };
    }

    if (
        code === 85 ||
        code === 86
    ) {
        return {
            icoon: "🌨️",
            tekst: "Sneeuwbuien"
        };
    }

    if (
        code === 95 ||
        code === 96 ||
        code === 99
    ) {
        return {
            icoon: "⛈️",
            tekst: "Onweer"
        };
    }

    return {
        icoon: "🌦️",
        tekst: "Onbekend weer"
    };
}


async function haalActueelWeerOp(kast) {
    if (
        !kast ||
        !Number.isFinite(Number(kast.latitude)) ||
        !Number.isFinite(Number(kast.longitude))
    ) {
        throw new Error(
            "Geen exacte standplaats ingesteld."
        );
    }

    const parameters =
        new URLSearchParams({
            latitude:
                String(kast.latitude),

            longitude:
                String(kast.longitude),

            current: [
                "temperature_2m",
                "apparent_temperature",
                "relative_humidity_2m",
                "precipitation",
                "weather_code",
                "wind_speed_10m",
                "wind_gusts_10m",
                "is_day"
            ].join(","),

            timezone: "auto",

            temperature_unit:
                "celsius",

            wind_speed_unit:
                "kmh",

            precipitation_unit:
                "mm"
        });

    const antwoord =
        await fetch(
            "https://api.open-meteo.com/v1/forecast?" +
            parameters.toString()
        );

    if (!antwoord.ok) {
        throw new Error(
            `Weer-API gaf foutcode ${antwoord.status}`
        );
    }

    const gegevens =
        await antwoord.json();

    if (!gegevens.current) {
        throw new Error(
            "Geen actuele weersgegevens ontvangen."
        );
    }

    const huidig =
        gegevens.current;

    const weerInformatie =
        maakWeerInformatie(
            huidig.weather_code
        );

    return {
        tijd:
            huidig.time ||
            new Date().toISOString(),

        icoon:
            weerInformatie.icoon,

        omschrijving:
            weerInformatie.tekst,

        temperatuur:
            Number(huidig.temperature_2m),

        gevoelstemperatuur:
            Number(
                huidig.apparent_temperature
            ),

        luchtvochtigheid:
            Number(
                huidig.relative_humidity_2m
            ),

        neerslag:
            Number(huidig.precipitation),

        windsnelheid:
            Number(huidig.wind_speed_10m),

        windvlagen:
            Number(huidig.wind_gusts_10m),

        isDag:
            Boolean(huidig.is_day),

        latitude:
            Number(kast.latitude),

        longitude:
            Number(kast.longitude)
    };
}


function maakWeerSamenvatting(weer) {
    if (!weer) {
        return "Geen weersgegevens opgeslagen";
    }

    return (
        `${weer.omschrijving}, ` +
        `${Math.round(weer.temperatuur)} °C`
    );
}


function maakWeerDetails(weer) {
    if (!weer) {
        return "";
    }

    return (
        `Gevoel ${Math.round(
            weer.gevoelstemperatuur
        )} °C · ` +

        `wind ${Math.round(
            weer.windsnelheid
        )} km/u · ` +

        `luchtvochtigheid ${Math.round(
            weer.luchtvochtigheid
        )}% · ` +

        `neerslag ${Number(
            weer.neerslag
        ).toFixed(1)} mm`
    );
}


function toonWeerBijControle(weer) {
    const icoon =
        haalElementOp(
            "controle-weer-icoon"
        );

    const samenvatting =
        haalElementOp(
            "controle-weer-samenvatting"
        );

    const details =
        haalElementOp(
            "controle-weer-details"
        );

    if (icoon) {
        icoon.textContent =
            weer ? weer.icoon : "⚠️";
    }

    if (samenvatting) {
        samenvatting.textContent =
            weer
                ? maakWeerSamenvatting(weer)
                : "Geen weersgegevens beschikbaar";
    }

    if (details) {
        details.textContent =
            weer
                ? maakWeerDetails(weer)
                : "Controleer of de kast een exacte locatie heeft en of je internetverbinding actief is.";
    }
}


async function laadWeerVoorControle(kast) {
    tijdelijkeWeerMeting = null;

    const samenvatting =
        haalElementOp(
            "controle-weer-samenvatting"
        );

    const details =
        haalElementOp(
            "controle-weer-details"
        );

    const icoon =
        haalElementOp(
            "controle-weer-icoon"
        );

    if (icoon) {
        icoon.textContent = "⏳";
    }

    if (samenvatting) {
        samenvatting.textContent =
            "Weergegevens worden opgehaald...";
    }

    if (details) {
        details.textContent =
            "Even geduld.";
    }

    try {
        tijdelijkeWeerMeting =
            await haalActueelWeerOp(kast);

        toonWeerBijControle(
            tijdelijkeWeerMeting
        );
    } catch (fout) {
        console.warn(
            "Weer ophalen mislukt:",
            fout
        );

        tijdelijkeWeerMeting = null;

        toonWeerBijControle(null);
    }
}

// ========================================
// CONTROLEFORMULIER OPENEN
// ========================================

function openControleFormulier() {
    const kast = haalActieveKastOp();

    if (!kast) {
        alert("Open eerst een bijenkast.");
        return;
    }

    laadWeerVoorControle(kast);

    zetTekst(
        "formulier-kastnaam",
        kast.naam
    );

    stelInvoerWaardeIn(
        "invoer-koningin",
        kast.koningin
    );

    stelInvoerWaardeIn(
        "invoer-broed",
        kast.broed
    );

    stelInvoerWaardeIn(
        "invoer-ramen-bezet",
        kast.ramenBezet
    );

    stelInvoerWaardeIn(
        "invoer-ramen-brias",
        kast.ramenBrias
    );

const maximaalAantalRamen =
    kast.ramenPerBroedkamer || 11;

const ramenBezetInvoer =
    haalElementOp("invoer-ramen-bezet");

const ramenBriasInvoer =
    haalElementOp("invoer-ramen-brias");

if (ramenBezetInvoer) {
    ramenBezetInvoer.max =
        maximaalAantalRamen;
}

if (ramenBriasInvoer) {
    ramenBriasInvoer.max =
        maximaalAantalRamen;
}

    stelInvoerWaardeIn(
        "invoer-broedkamers",
        kast.broedkamers
    );

    stelInvoerWaardeIn(
        "invoer-honingkamers",
        kast.honingkamers
    );

    stelInvoerWaardeIn(
        "invoer-ruimte",
        kast.ruimte
    );

    stelInvoerWaardeIn(
        "invoer-voer",
        kast.voer
    );

    stelInvoerWaardeIn(
        "invoer-varroa",
        kast.varroa
    );

    const honingMeegenomen =
        haalElementOp(
            "invoer-honing-meegenomen"
        );

    if (honingMeegenomen) {
        honingMeegenomen.checked = false;
    }

    stelInvoerWaardeIn(
        "invoer-honingramen",
        0
    );

    stelInvoerWaardeIn(
        "invoer-apifonda",
        0
    );

    stelInvoerWaardeIn(
        "invoer-suikerwater",
        0
    );

    stelInvoerWaardeIn(
        "invoer-notities",
        ""
    );

const temperamentScore =
    kast.temperamentScore ||
    maakTemperamentScore(
        kast.temperament
    );

stelInvoerWaardeIn(
    "invoer-temperament",
    temperamentScore
);

werkTemperamentVoorbeeldBij();    

const automatischCheckbox =
    haalElementOp(
        "invoer-automatisch-advies"
    );

if (automatischCheckbox) {
    automatischCheckbox.checked =
        kast.automatischControleAdvies !== false;
}

stelInvoerWaardeIn(
    "invoer-volgende-controle",
    kast.volgendeControleDatum || ""
);

werkControleAdviesBij();

    verbergScherm("kast-detail");
    toonScherm("controle-formulier-scherm");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function stelInvoerWaardeIn(id, waarde) {
    const element = haalElementOp(id);

    if (element) {
        element.value = waarde ?? "";
    }
}


// ========================================
// CONTROLE OPSLAAN
// ========================================

async function slaControleOp(event) {
    event.preventDefault();

    const kast = haalActieveKastOp();

    if (!kast) {
        return;
    }

    const seizoen =
        haalSeizoensgegevensOp(kast);
     
        let weerTijdensControle =
    tijdelijkeWeerMeting;

if (!weerTijdensControle) {
    try {
        weerTijdensControle =
            await haalActueelWeerOp(kast);
    } catch (fout) {
        console.warn(
            "De controle wordt zonder weer opgeslagen:",
            fout
        );

        weerTijdensControle = null;
    }
}

    kast.koningin =
        leesInvoerWaarde(
            "invoer-koningin",
            kast.koningin
        );

    kast.broed =
        leesInvoerWaarde(
            "invoer-broed",
            kast.broed
        );

    kast.ramenBezet =
        leesGetal(
            "invoer-ramen-bezet",
            kast.ramenBezet
        );

    kast.ramenBrias =
        leesGetal(
            "invoer-ramen-brias",
            kast.ramenBrias
        );

    kast.broedkamers =
        leesGetal(
            "invoer-broedkamers",
            kast.broedkamers
        );

    kast.honingkamers =
        leesGetal(
            "invoer-honingkamers",
            kast.honingkamers
        );

    kast.ruimte =
        leesInvoerWaarde(
            "invoer-ruimte",
            kast.ruimte
        );

    kast.voer =
        leesInvoerWaarde(
            "invoer-voer",
            kast.voer
        );

    kast.varroa =
        leesInvoerWaarde(
            "invoer-varroa",
            kast.varroa
        );

const temperamentScore =
    Number(
        leesInvoerWaarde(
            "invoer-temperament",
            2
        )
    );

kast.temperamentScore =
    temperamentScore;

kast.temperament =
    maakTemperamentTekst(
        temperamentScore
    );
    const nieuweNotities =
        leesInvoerWaarde(
            "invoer-notities",
            ""
        ).trim();

    kast.notities =
        nieuweNotities ||
        "Geen notities toegevoegd.";

const automatischCheckbox =
    haalElementOp(
        "invoer-automatisch-advies"
    );

kast.automatischControleAdvies =
    automatischCheckbox
        ? automatischCheckbox.checked
        : true;

const gekozenControleDatum =
    leesInvoerWaarde(
        "invoer-volgende-controle",
        ""
    );

if (kast.automatischControleAdvies) {
    const advies =
        berekenControleAdvies(kast);

    kast.volgendeControleDatum =
        maakIsoDatum(
            voegDagenToe(
                new Date(),
                advies.dagen
            )
        );

    kast.controleAdviesDagen =
        advies.dagen;

    kast.controleAdviesReden =
        advies.reden;
} else {
    kast.volgendeControleDatum =
        gekozenControleDatum;

    kast.controleAdviesDagen =
        null;

    kast.controleAdviesReden =
        "Handmatig ingestelde controledatum";
}

    const honingCheckbox =
        haalElementOp(
            "invoer-honing-meegenomen"
        );

    const honingMeegenomen =
        honingCheckbox
            ? honingCheckbox.checked
            : false;

    const honingRamen =
        leesGetal(
            "invoer-honingramen",
            0
        );

    const apifonda =
        leesGetal(
            "invoer-apifonda",
            0
        );

    const suikerwater =
        leesGetal(
            "invoer-suikerwater",
            0
        );

    if (
        honingMeegenomen &&
        honingRamen > 0
    ) {
        seizoen.honingGeoogst = true;

        seizoen.honingRamenGeoogst =
            Number(
                seizoen.honingRamenGeoogst || 0
            ) + honingRamen;
    }

    const voeracties = [];

    if (apifonda > 0) {
        seizoen.apifondaZakken =
            Number(
                seizoen.apifondaZakken || 0
            ) + apifonda;

        voeracties.push(
            `${apifonda} zakken Apifonda`
        );
    }

    if (suikerwater > 0) {
        seizoen.suikerwaterLiter =
            Number(
                seizoen.suikerwaterLiter || 0
            ) + suikerwater;

        voeracties.push(
            `${suikerwater} liter suikerwater`
        );
    }

    if (voeracties.length > 0) {
        seizoen.laatsteVoeractie =
            `${maakDatumTekst()} - ${voeracties.join(" en ")}`;
    }

    kast.laatsteControle =
        maakDatumTekst();


    if (!Array.isArray(kast.historie)) {
        kast.historie = [];
    }

kast.historie.unshift({
    datum:
        kast.laatsteControle,

    tijdstip:
        new Intl.DateTimeFormat(
            "nl-NL",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        ).format(new Date()),

    status:
        kast.status,

    temperament:
        kast.temperament,

    temperamentScore:
        kast.temperamentScore,

    weer:
        weerTijdensControle,

    snapshot: {
        koningin: kast.koningin,
        broed: kast.broed,
        ramenBezet: kast.ramenBezet,
        ramenBrias: kast.ramenBrias,
        ramenPerBroedkamer: kast.ramenPerBroedkamer || 11,
        broedkamers: kast.broedkamers,
        honingkamers: kast.honingkamers,
        ruimte: kast.ruimte,
        voer: kast.voer,
        varroa: kast.varroa,
        temperament: kast.temperament,
        temperamentScore: kast.temperamentScore,
        notities: kast.notities,
        honingMeegenomen: honingMeegenomen,
        honingRamen: honingRamen,
        apifonda: apifonda,
        suikerwater: suikerwater,
        volgendeControleDatum: kast.volgendeControleDatum,
        controleAdviesReden: kast.controleAdviesReden,
        automatischControleAdvies: kast.automatischControleAdvies
    },

    notitie:
        `${kast.ramenBezet} ramen bezet, ` +
        `${kast.ramenBrias} ramen BRIAS. ` +
        kast.notities
});

    bewaarGegevens();
    toonKastenOverzicht();
    openKast(kast.id);
    tijdelijkeWeerMeting = null;
}

function leesInvoerWaarde(id, standaardWaarde) {
    const element = haalElementOp(id);

    if (!element) {
        return standaardWaarde;
    }

    return element.value;
}

function leesGetal(id, standaardWaarde = 0) {
    const element = haalElementOp(id);

    if (!element) {
        return standaardWaarde;
    }

    const getal = Number(element.value);

    return Number.isFinite(getal)
        ? getal
        : standaardWaarde;
}
function werkControleAdviesBij() {
    const kast = haalActieveKastOp();

    if (!kast) {
        return;
    }

    const automatischCheckbox =
        haalElementOp(
            "invoer-automatisch-advies"
        );

    const datumInvoer =
        haalElementOp(
            "invoer-volgende-controle"
        );

    const uitleg =
        haalElementOp(
            "controle-advies-voorbeeld"
        );

    if (
        !automatischCheckbox ||
        !datumInvoer ||
        !uitleg
    ) {
        return;
    }

    if (!automatischCheckbox.checked) {
        datumInvoer.disabled = false;

        uitleg.textContent =
            "De datum wordt handmatig ingesteld.";

        return;
    }

    const tijdelijkeKast = {
        ...kast,

        koningin:
            leesInvoerWaarde(
                "invoer-koningin",
                kast.koningin
            ),

        broed:
            leesInvoerWaarde(
                "invoer-broed",
                kast.broed
            ),

        voer:
            leesInvoerWaarde(
                "invoer-voer",
                kast.voer
            ),

        varroa:
            leesInvoerWaarde(
                "invoer-varroa",
                kast.varroa
            ),

        ruimte:
            leesInvoerWaarde(
                "invoer-ruimte",
                kast.ruimte
            )
    };

    const advies =
        berekenControleAdvies(
            tijdelijkeKast
        );

    datumInvoer.value =
        maakIsoDatum(
            voegDagenToe(
                new Date(),
                advies.dagen
            )
        );

    datumInvoer.disabled = true;

    uitleg.textContent =
        `${advies.reden}. Advies: over ${advies.dagen} dagen.`;
}

// ========================================
// CONTROLEHISTORIE
// ========================================

function toonHistorie(historie) {
    const controleHistorie =
        haalElementOp("controle-historie");

    if (!controleHistorie) {
        return;
    }

    controleHistorie.innerHTML = "";

    if (
        !Array.isArray(historie) ||
        historie.length === 0
    ) {
        controleHistorie.innerHTML = `
            <p class="lege-melding">
                Er zijn nog geen controles geregistreerd.
            </p>
        `;
        return;
    }

    historie.forEach((controle, index) => {
        const kaart =
            document.createElement("article");

        kaart.className =
            "historie-kaart historie-kaart-klikbaar";

        kaart.tabIndex = 0;
        kaart.setAttribute("role", "button");
        kaart.setAttribute(
            "aria-label",
            `Bekijk controle van ${controle.datum}`
        );

        const weerHtml = controle.weer
            ? `
                <div class="historie-weer">
                    <div class="historie-weer-icoon">
                        ${maakVeiligeTekst(controle.weer.icoon)}
                    </div>
                    <div class="historie-weer-inhoud">
                        <strong>
                            ${maakVeiligeTekst(maakWeerSamenvatting(controle.weer))}
                        </strong>
                        <span>
                            ${maakVeiligeTekst(maakWeerDetails(controle.weer))}
                        </span>
                    </div>
                </div>
            `
            : `
                <div class="historie-weer">
                    <div class="historie-weer-icoon">🌦️</div>
                    <div class="historie-weer-inhoud">
                        <strong>Geen weer opgeslagen</strong>
                        <span>
                            Deze controle is uitgevoerd voordat
                            weerregistratie was toegevoegd.
                        </span>
                    </div>
                </div>
            `;

        const temperamentHtml = controle.temperament
            ? `
                <span>
                    Temperament:
                    ${maakVeiligeTekst(controle.temperament)}
                </span>
            `
            : "";

        kaart.innerHTML = `
            <div class="historie-kop">
                <strong>
                    ${maakVeiligeTekst(controle.datum)}
                    ${
                        controle.tijdstip
                            ? ` · ${maakVeiligeTekst(controle.tijdstip)}`
                            : ""
                    }
                </strong>

                <div class="historie-kop-rechts">
                    <span class="historie-status">
                        ${maakVeiligeTekst(controle.status)}
                    </span>
                    <span class="historie-open-pijl">›</span>
                </div>
            </div>

            <p>${maakVeiligeTekst(controle.notitie)}</p>
            ${temperamentHtml}
            ${weerHtml}
        `;

        kaart.addEventListener(
            "click",
            function () {
                openHistorischeControle(index);
            }
        );

        kaart.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    openHistorischeControle(index);
                }
            }
        );

        controleHistorie.appendChild(kaart);
    });
}

function openHistorischeControle(index) {
    const kast = haalActieveKastOp();

    if (
        !kast ||
        !Array.isArray(kast.historie) ||
        !kast.historie[index]
    ) {
        return;
    }

    actieveHistorieIndex = index;

    const controle = kast.historie[index];
    const snapshot = controle.snapshot || {};

    zetTekst(
        "historie-detail-titel",
        `Controle van ${controle.datum}${controle.tijdstip ? ` · ${controle.tijdstip}` : ""}`
    );

    zetTekst(
        "historie-detail-subtitel",
        controle.snapshot
            ? `${kast.naam} · alle opgeslagen gegevens`
            : `${kast.naam} · beperkte gegevens uit oudere controle`
    );

    zetTekst("historie-detail-koningin", snapshot.koningin || "Niet opgeslagen");
    zetTekst("historie-detail-broed", snapshot.broed || "Niet opgeslagen");

    zetTekst(
        "historie-detail-ramen-bezet",
        snapshot.ramenBezet !== undefined
            ? `${snapshot.ramenBezet} van ${snapshot.ramenPerBroedkamer || kast.ramenPerBroedkamer || 11}`
            : "Niet opgeslagen"
    );

    zetTekst(
        "historie-detail-ramen-brias",
        snapshot.ramenBrias !== undefined
            ? `${snapshot.ramenBrias} van ${snapshot.ramenPerBroedkamer || kast.ramenPerBroedkamer || 11}`
            : "Niet opgeslagen"
    );

    zetTekst(
        "historie-detail-temperament",
        snapshot.temperament || controle.temperament || "Niet opgeslagen"
    );

    zetTekst("historie-detail-broedkamers", snapshot.broedkamers ?? "Niet opgeslagen");
    zetTekst("historie-detail-honingkamers", snapshot.honingkamers ?? "Niet opgeslagen");
    zetTekst("historie-detail-ruimte", snapshot.ruimte || "Niet opgeslagen");
    zetTekst("historie-detail-voer", snapshot.voer || "Niet opgeslagen");
    zetTekst("historie-detail-varroa", snapshot.varroa || "Niet opgeslagen");

    zetTekst(
        "historie-detail-honing",
        snapshot.honingMeegenomen === true
            ? "Ja"
            : snapshot.honingMeegenomen === false
                ? "Nee"
                : "Niet opgeslagen"
    );

    zetTekst("historie-detail-honingramen", snapshot.honingRamen ?? "Niet opgeslagen");

    zetTekst(
        "historie-detail-apifonda",
        snapshot.apifonda !== undefined
            ? `${snapshot.apifonda} zakken`
            : "Niet opgeslagen"
    );

    zetTekst(
        "historie-detail-suikerwater",
        snapshot.suikerwater !== undefined
            ? `${snapshot.suikerwater} liter`
            : "Niet opgeslagen"
    );

    zetTekst(
        "historie-detail-volgende-controle",
        snapshot.volgendeControleDatum
            ? formatteerIsoDatum(snapshot.volgendeControleDatum)
            : "Niet opgeslagen"
    );

    zetTekst(
        "historie-detail-advies-reden",
        snapshot.controleAdviesReden || "Niet opgeslagen"
    );

    zetTekst(
        "historie-detail-notities",
        snapshot.notities || controle.notitie || "Geen notities opgeslagen"
    );

    const weerIcoon = haalElementOp("historie-detail-weer-icoon");
    const weerSamenvatting = haalElementOp("historie-detail-weer-samenvatting");
    const weerDetails = haalElementOp("historie-detail-weer-details");

    if (controle.weer) {
        if (weerIcoon) weerIcoon.textContent = controle.weer.icoon;
        if (weerSamenvatting) weerSamenvatting.textContent = maakWeerSamenvatting(controle.weer);
        if (weerDetails) weerDetails.textContent = maakWeerDetails(controle.weer);
    } else {
        if (weerIcoon) weerIcoon.textContent = "🌦️";
        if (weerSamenvatting) weerSamenvatting.textContent = "Geen weer opgeslagen";
        if (weerDetails) weerDetails.textContent = "Deze controle bevat geen weersnapshot.";
    }

    verbergScherm("kast-detail");
    verbergScherm("controle-formulier-scherm");
    verbergScherm("kast-kaart-scherm");
    toonScherm("historische-controle-scherm");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function sluitHistorischeControle() {
    actieveHistorieIndex = null;
    verbergScherm("historische-controle-scherm");

    if (actieveKastId !== null) {
        toonScherm("kast-detail");
    }
}

// ========================================
// INSTELLINGEN
// ========================================

function vulInstellingenKastKeuze(
    geselecteerdeKastId = null
) {
    const keuze =
        haalElementOp(
            "instellingen-kast-keuze"
        );

    if (!keuze) {
        return;
    }

    keuze.innerHTML = "";

    bijenkasten.forEach((kast) => {
        const optie =
            document.createElement("option");

        optie.value = kast.id;

        optie.textContent =
            `${kast.naam} - ${kast.locatie}`;

        keuze.appendChild(optie);
    });

    if (geselecteerdeKastId !== null) {
        keuze.value =
            String(geselecteerdeKastId);
    }
}

function openInstellingen() {
    if (bijenkasten.length === 0) {
        alert(
            "Er zijn nog geen bijenkasten om aan te passen."
        );

        return;
    }

    const teOpenenKastId =
        actieveKastId || bijenkasten[0].id;

    vulInstellingenKastKeuze(
        teOpenenKastId
    );

    vulInstellingenFormulier(
        teOpenenKastId
    );

    toonScherm("instellingen-scherm");
}

function sluitInstellingen() {
    verbergScherm("instellingen-scherm");

    tijdelijkeKastFoto = null;

    const fotoInvoer =
        haalElementOp("instellingen-foto");

    if (fotoInvoer) {
        fotoInvoer.value = "";
    }
}

function vulInstellingenFormulier(kastId) {
    const kast = bijenkasten.find((item) => item.id === Number(kastId));

    if (!kast) {
        return;
    }

    const seizoen = haalSeizoensgegevensOp(kast);

    stelInvoerWaardeIn("instellingen-naam", kast.naam);
    stelInvoerWaardeIn("instellingen-locatie", kast.locatie);
    stelInvoerWaardeIn("instellingen-zoekadres",kast.zoekAdres || "");
    stelInvoerWaardeIn("instellingen-latitude", kast.latitude ?? "");
    stelInvoerWaardeIn("instellingen-longitude", kast.longitude ?? "");

    const locatieStatus = haalElementOp("locatie-status");
    if (locatieStatus) {
        locatieStatus.textContent = heeftExacteLocatie(kast)
            ? "Exacte standplaats is ingesteld."
            : "Nog geen exacte standplaats ingesteld.";
    }

    stelInvoerWaardeIn("instellingen-apifonda", seizoen.apifondaZakken || 0);
    stelInvoerWaardeIn("instellingen-aantal-ramen", kast.ramenPerBroedkamer || 11);
    stelInvoerWaardeIn("instellingen-suikerwater", seizoen.suikerwaterLiter || 0);
    stelInvoerWaardeIn("instellingen-honingramen", seizoen.honingRamenGeoogst || 0);
    stelInvoerWaardeIn("instellingen-laatste-voeractie", seizoen.laatsteVoeractie || "");
    stelInvoerWaardeIn("instellingen-laatste-behandeling", seizoen.laatsteBehandeling || "");
    stelInvoerWaardeIn("instellingen-kasttype", kast.kasttype || "Spaarkast");
    stelInvoerWaardeIn("instellingen-koningin-markering", kast.koninginMarkering || "niet-gemarkeerd");
    stelInvoerWaardeIn("instellingen-herkomst", kast.herkomst || "");

    const honingGeoogstCheckbox = haalElementOp("instellingen-honing-geoogst");
    if (honingGeoogstCheckbox) {
        honingGeoogstCheckbox.checked = Boolean(seizoen.honingGeoogst);
    }

    tijdelijkeKastFoto = kast.foto || null;
    toonFotoPreview(tijdelijkeKastFoto);

    const fotoInvoer = haalElementOp("instellingen-foto");
    if (fotoInvoer) {
        fotoInvoer.value = "";
    }
}

function toonFotoPreview(foto) {
    const preview =
        haalElementOp("kast-foto-preview");

    if (!preview) {
        return;
    }

    if (foto) {
        preview.innerHTML = `
            <img
                src="${foto}"
                alt="Voorbeeld van de kastfoto"
            >
        `;
    } else {
        preview.innerHTML = `
            <span>🐝</span>
            <p>Nog geen foto</p>
        `;
    }
}


// ========================================
// FOTO KIEZEN EN VERKLEINEN
// ========================================

function verwerkGekozenFoto(event) {
    const bestand =
        event.target.files[0];

    if (!bestand) {
        return;
    }

    if (!bestand.type.startsWith("image/")) {
        alert(
            "Kies een geldig afbeeldingsbestand."
        );

        event.target.value = "";
        return;
    }

    const maximaalBestandsformaat =
        10 * 1024 * 1024;

    if (
        bestand.size >
        maximaalBestandsformaat
    ) {
        alert(
            "De foto is groter dan 10 MB. " +
            "Kies een kleinere foto."
        );

        event.target.value = "";
        return;
    }

    const lezer = new FileReader();

    lezer.addEventListener(
        "load",
        function () {
            verkleinFoto(
                lezer.result,
                function (verkleindeFoto) {
                    tijdelijkeKastFoto =
                        verkleindeFoto;

                    toonFotoPreview(
                        tijdelijkeKastFoto
                    );
                }
            );
        }
    );

    lezer.addEventListener(
        "error",
        function () {
            alert(
                "De foto kon niet worden ingelezen."
            );
        }
    );

    lezer.readAsDataURL(bestand);
}

function verkleinFoto(
    fotoData,
    klaar
) {
    const afbeelding = new Image();

    afbeelding.addEventListener(
        "load",
        function () {
            const maximaleBreedte = 1200;
            const maximaleHoogte = 1200;

            let breedte =
                afbeelding.naturalWidth;

            let hoogte =
                afbeelding.naturalHeight;

            const verhouding = Math.min(
                maximaleBreedte / breedte,
                maximaleHoogte / hoogte,
                1
            );

            breedte = Math.round(
                breedte * verhouding
            );

            hoogte = Math.round(
                hoogte * verhouding
            );

            const canvas =
                document.createElement("canvas");

            canvas.width = breedte;
            canvas.height = hoogte;

            const context =
                canvas.getContext("2d");

            if (!context) {
                klaar(fotoData);
                return;
            }

            context.drawImage(
                afbeelding,
                0,
                0,
                breedte,
                hoogte
            );

            const verkleindeFoto =
                canvas.toDataURL(
                    "image/jpeg",
                    0.82
                );

            klaar(verkleindeFoto);
        }
    );

    afbeelding.addEventListener(
        "error",
        function () {
            alert(
                "De foto kon niet worden verwerkt."
            );
        }
    );

    afbeelding.src = fotoData;
}

function verwijderTijdelijkeFoto() {
    tijdelijkeKastFoto = null;

    const fotoInvoer =
        haalElementOp("instellingen-foto");

    if (fotoInvoer) {
        fotoInvoer.value = "";
    }

    toonFotoPreview(null);
}


// ========================================
// INSTELLINGEN OPSLAAN
// ========================================

function slaKastInstellingenOp(event) {
    event.preventDefault();

    const kastKeuze =
        haalElementOp(
            "instellingen-kast-keuze"
        );

    if (!kastKeuze) {
        return;
    }

    const kastId =
        Number(kastKeuze.value);

    const kast = bijenkasten.find(
        (item) => item.id === kastId
    );

    if (!kast) {
        alert(
            "De gekozen bijenkast kon niet worden gevonden."
        );

        return;
    }

    const naamElement =
        haalElementOp("instellingen-naam");

    const locatieElement =
        haalElementOp(
            "instellingen-locatie"
        );

    const nieuweNaam =
        naamElement
            ? naamElement.value.trim()
            : "";

    const nieuweLocatie =
        locatieElement
            ? locatieElement.value.trim()
            : "";

    if (!nieuweNaam) {
        alert(
            "Vul een naam voor de bijenkast in."
        );

        naamElement?.focus();
        return;
    }

    if (!nieuweLocatie) {
        alert(
            "Vul een locatie voor de bijenkast in."
        );

        locatieElement?.focus();
        return;
    }

    const latitudeTekst = leesInvoerWaarde("instellingen-latitude", "").trim();
    const longitudeTekst = leesInvoerWaarde("instellingen-longitude", "").trim();

    const heeftLatitude = latitudeTekst !== "";
    const heeftLongitude = longitudeTekst !== "";

    if (heeftLatitude !== heeftLongitude) {
        alert("Vul zowel de breedtegraad als de lengtegraad in.");
        return;
    }

    let latitude = null;
    let longitude = null;

    if (heeftLatitude && heeftLongitude) {
        latitude = Number(latitudeTekst);
        longitude = Number(longitudeTekst);

        if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
            !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
            alert("De ingevoerde coördinaten zijn niet geldig.");
            return;
        }
    }

    kast.naam = nieuweNaam;
    kast.locatie = nieuweLocatie;
    kast.zoekAdres =
    leesInvoerWaarde(
        "instellingen-zoekadres","").trim();

kast.latitude = latitude;
kast.longitude = longitude;
    kast.foto = tijdelijkeKastFoto;
    kast.ramenPerBroedkamer =
    leesGetal(
        "instellingen-aantal-ramen",
        11
    );
    kast.kasttype =
    leesInvoerWaarde(
        "instellingen-kasttype",
        "Spaarkast"
    );

kast.koninginMarkering =
    leesInvoerWaarde(
        "instellingen-koningin-markering",
        "niet-gemarkeerd"
    );

kast.herkomst =
    leesInvoerWaarde(
        "instellingen-herkomst",
        ""
    ).trim() || "Niet ingevuld";
const seizoen =
    haalSeizoensgegevensOp(kast);

seizoen.apifondaZakken =
    leesGetal(
        "instellingen-apifonda",
        0
    );

seizoen.suikerwaterLiter =
    leesGetal(
        "instellingen-suikerwater",
        0
    );

seizoen.honingRamenGeoogst =
    leesGetal(
        "instellingen-honingramen",
        0
    );

const honingGeoogstCheckbox =
    haalElementOp(
        "instellingen-honing-geoogst"
    );

seizoen.honingGeoogst =
    honingGeoogstCheckbox
        ? honingGeoogstCheckbox.checked
        : false;

seizoen.laatsteVoeractie =
    leesInvoerWaarde(
        "instellingen-laatste-voeractie",
        ""
    ).trim() || "Nog niet geregistreerd";

seizoen.laatsteBehandeling =
    leesInvoerWaarde(
        "instellingen-laatste-behandeling",
        ""
    ).trim() || "Geen behandeling geregistreerd";
    bewaarGegevens();
    toonKastenOverzicht();

    if (actieveKastId === kast.id) {
        vulKastdetail(kast);
    }

    sluitInstellingen();
}


// ========================================
// KAST VERWIJDEREN
// ========================================

function verwijderGeselecteerdeKast() {
    const kastKeuze =
        haalElementOp("instellingen-kast-keuze");

    if (!kastKeuze) {
        return;
    }

    const kastId = Number(kastKeuze.value);

    const kast = bijenkasten.find(
        (item) => item.id === kastId
    );

    if (!kast) {
        alert(
            "De gekozen bijenkast kon niet worden gevonden."
        );

        return;
    }

    const eersteBevestiging = confirm(
        `Weet je zeker dat je "${kast.naam}" wilt verwijderen?\n\n` +
        "Alle controles, foto's en seizoensgegevens van deze kast " +
        "worden permanent verwijderd."
    );

    if (!eersteBevestiging) {
        return;
    }

    const tweedeBevestiging = confirm(
        `Laatste controle:\n\n` +
        `Klik op OK om "${kast.naam}" definitief te verwijderen.`
    );

    if (!tweedeBevestiging) {
        return;
    }

    bijenkasten = bijenkasten.filter(
        (item) => item.id !== kastId
    );

    if (actieveKastId === kastId) {
        actieveKastId = null;
    }

    bewaarGegevens();
    toonKastenOverzicht();
    sluitInstellingen();

    verbergScherm("kast-detail");
    verbergScherm("controle-formulier-scherm");
    toonScherm("kasten-overzicht");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    alert(
        `"${kast.naam}" is verwijderd.`
    );
}
// ========================================
// BACK-UP DOWNLOADEN
// ========================================

function exporteerGegevens() {
    const backUp = {
        app: "Bijen Controle App",
        versie: 1,
        exportDatum: new Date().toISOString(),
        actiefSeizoen: actiefSeizoen,
        bijenkasten: bijenkasten
    };

    const jsonTekst = JSON.stringify(
        backUp,
        null,
        2
    );

    const bestand = new Blob(
        [jsonTekst],
        {
            type: "application/json"
        }
    );

    const downloadUrl =
        URL.createObjectURL(bestand);

    const datum =
        new Date()
            .toISOString()
            .slice(0, 10);

    const downloadLink =
        document.createElement("a");

    downloadLink.href = downloadUrl;

    downloadLink.download =
        `bijen-controle-backup-${datum}.json`;

    document.body.appendChild(
        downloadLink
    );

    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(
        downloadUrl
    );
}


// ========================================
// BACK-UP TERUGZETTEN
// ========================================

function importeerGegevens(event) {
    const bestand =
        event.target.files[0];

    if (!bestand) {
        return;
    }

    const lezer = new FileReader();

    lezer.addEventListener(
        "load",
        function () {
            try {
                const inhoud =
                    JSON.parse(lezer.result);

                const nieuweKasten =
                    Array.isArray(inhoud)
                        ? inhoud
                        : inhoud.bijenkasten;

                if (!Array.isArray(nieuweKasten)) {
                    throw new Error(
                        "Geen geldige lijst met bijenkasten gevonden."
                    );
                }

                const bevestiging = confirm(
                    "Weet je zeker dat je deze back-up wilt terugzetten?\n\n" +
                    "Je huidige gegevens worden hierdoor vervangen."
                );

                if (!bevestiging) {
                    event.target.value = "";
                    return;
                }

                bijenkasten =
                    maakKopie(nieuweKasten);

                if (
                    inhoud.actiefSeizoen &&
                    Number.isFinite(
                        Number(inhoud.actiefSeizoen)
                    )
                ) {
                    actiefSeizoen =
                        Number(inhoud.actiefSeizoen);
                }

                actieveKastId = null;

                bewaarGegevens();
                toonKastenOverzicht();
                sluitInstellingen();

                verbergScherm("kast-detail");
                verbergScherm(
                    "controle-formulier-scherm"
                );
                toonScherm("kasten-overzicht");

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                alert(
                    "De back-up is succesvol teruggezet."
                );
            } catch (fout) {
                console.error(
                    "Importeren mislukt:",
                    fout
                );

                alert(
                    "Dit bestand is geen geldige back-up van de Bijen Controle App."
                );
            } finally {
                event.target.value = "";
            }
        }
    );

    lezer.addEventListener(
        "error",
        function () {
            alert(
                "Het back-upbestand kon niet worden gelezen."
            );

            event.target.value = "";
        }
    );

    lezer.readAsText(bestand);
}


// ========================================
// ALLE GEGEVENS WISSEN
// ========================================

function wisAlleGegevens() {
    const eersteBevestiging = confirm(
        "Weet je zeker dat je ALLE gegevens wilt wissen?\n\n" +
        "Alle kasten, foto's, controles en seizoensgegevens worden verwijderd."
    );

    if (!eersteBevestiging) {
        return;
    }

    const tweedeBevestiging = confirm(
        "Dit kan niet ongedaan worden gemaakt.\n\n" +
        "Klik alleen op OK als je eerst een back-up hebt gemaakt."
    );

    if (!tweedeBevestiging) {
        return;
    }

    localStorage.removeItem(
        opslagNaam
    );

    bijenkasten =
        maakKopie(standaardBijenkasten);

    actieveKastId = null;
    tijdelijkeKastFoto = null;

    bewaarGegevens();
    toonKastenOverzicht();
    sluitInstellingen();

    verbergScherm("kast-detail");
    verbergScherm(
        "controle-formulier-scherm"
    );
    toonScherm("kasten-overzicht");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    alert(
        "Alle gegevens zijn gewist. De standaardkasten zijn opnieuw geladen."
    );
}
// ========================================
// KNOPPEN ACTIVEREN
// ========================================

function activeerKnop(
    id,
    gebeurtenis,
    functie
) {
    const element = haalElementOp(id);

    if (element) {
        element.addEventListener(
            gebeurtenis,
            functie
        );
    }
}
activeerKnop(
    "invoer-temperament",
    "input",
    werkTemperamentVoorbeeldBij
);

function activeerKnoppen() {
    activeerKnop("kaart-openen-knop", "click", openKastKaart);
    activeerKnop("historie-detail-terug-knop", "click", sluitHistorischeControle);
    activeerKnop("kaart-terug-knop", "click", sluitKastKaart);
    activeerKnop("adres-zoeken-knop","click",zoekAdresLocatie);
    activeerKnop("huidige-locatie-knop", "click", gebruikHuidigeLocatie);

    [1, 3, 5].forEach((afstand) => {
        activeerKnop(`kaart-cirkel-${afstand}`, "change", werkKaartCirkelsBij);
    });

    activeerKnop(
        "terug-knop",
        "click",
        function () {
            verbergScherm("kast-detail");
            verbergScherm(
                "controle-formulier-scherm"
            );
            verbergScherm("kast-kaart-scherm");
            verbergScherm("historische-controle-scherm");
            toonScherm("kasten-overzicht");

            actieveKastId = null;

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
    [
    "invoer-koningin",
    "invoer-broed",
    "invoer-voer",
    "invoer-varroa",
    "invoer-ruimte"
].forEach((id) => {
    activeerKnop(
        id,
        "change",
        werkControleAdviesBij
    );
});

activeerKnop(
    "invoer-automatisch-advies",
    "change",
    werkControleAdviesBij
);

    activeerKnop(
    "kast-verwijderen-knop",
    "click",
    verwijderGeselecteerdeKast
);

    activeerKnop(
        "controle-starten-knop",
        "click",
        openControleFormulier
    );

    activeerKnop(
        "controle-annuleren-knop",
        "click",
        function () {
            if (actieveKastId !== null) {
                openKast(actieveKastId);
            }
        }
    );

    activeerKnop(
        "controle-formulier",
        "submit",
        slaControleOp
    );

    activeerKnop(
        "instellingen-knop",
        "click",
        openInstellingen
    );

    activeerKnop(
        "instellingen-sluiten-knop",
        "click",
        sluitInstellingen
    );

    activeerKnop(
        "instellingen-annuleren-knop",
        "click",
        sluitInstellingen
    );

    activeerKnop(
        "instellingen-kast-keuze",
        "change",
        function (event) {
            vulInstellingenFormulier(
                event.target.value
            );
        }
    );
    activeerKnop(
    "gegevens-exporteren-knop",
    "click",
    exporteerGegevens
);

    activeerKnop(
    "gegevens-importeren-bestand",
    "change",
    importeerGegevens
);

    activeerKnop(
    "alle-gegevens-wissen-knop",
    "click",
    wisAlleGegevens
);
    activeerKnop(
        "instellingen-foto",
        "change",
        verwerkGekozenFoto
    );

    activeerKnop(
        "foto-verwijderen-knop",
        "click",
        verwijderTijdelijkeFoto
    );

    activeerKnop(
        "instellingen-formulier",
        "submit",
        slaKastInstellingenOp
    );

    activeerKnop(
    "nieuwe-kast-instellingen-knop",
    "click",
    voegNieuweKastToe
);

    const instellingenScherm =
        haalElementOp("instellingen-scherm");

    if (instellingenScherm) {
        instellingenScherm.addEventListener(
            "click",
            function (event) {
                if (
                    event.target ===
                    instellingenScherm
                ) {
                    sluitInstellingen();
                }
            }
        );
    }
}


// ========================================
// APP STARTEN
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {
        toonKastenOverzicht();
        activeerKnoppen();

        console.log(
            `Bijen Controle App gestart voor seizoen ${actiefSeizoen}.`
        );
    }
);
// ========================================
// NIEUWE KAST TOEVOEGEN
// ========================================

function voegNieuweKastToe() {
    const hoogsteId = bijenkasten.reduce(
        (hoogste, kast) => Math.max(hoogste, kast.id),
        0
    );

    const nieuwId = hoogsteId + 1;

    const nieuweKast = {
        id: nieuwId,
        naam: `Kast ${nieuwId}`,
        locatie: "Nog invullen",
        latitude: null,
        longitude: null,
        foto: null,

        status: "Aandacht",
        laatsteControle: "Nog niet gecontroleerd",
        dagenGeleden: "-",

        koningin: "Niet gecontroleerd",
        broed: "Niet gecontroleerd",
        voer: "Niet gecontroleerd",
        varroa: "Niet gecontroleerd",
        ruimte: "Niet gecontroleerd",

        ramenBezet: 1,
        ramenBrias: 0,
        broedkamers: 1,
        honingkamers: 0,

        volgendeActie:
            "Eerste controle uitvoeren",

        temperament: "Niet gecontroleerd",

        notities:
            "Deze kast is nieuw toegevoegd.",

        kasttype: "Nog invullen",
        koninginMarkering: "wit",
        herkomst: "Nog invullen",

        seizoenen: {
            [actiefSeizoen]: {
                honingGeoogst: false,
                honingRamenGeoogst: 0,
                apifondaZakken: 0,
                suikerwaterLiter: 0,
                laatsteVoeractie:
                    "Nog niet geregistreerd",
                laatsteBehandeling:
                    "Geen behandeling geregistreerd"
            }
        },

        historie: []
    };

    bijenkasten.push(nieuweKast);

    bewaarGegevens();
    toonKastenOverzicht();

    vulInstellingenKastKeuze(nieuwId);

    const kastKeuze =
        haalElementOp("instellingen-kast-keuze");

    if (kastKeuze) {
        kastKeuze.value = String(nieuwId);
    }

    vulInstellingenFormulier(nieuwId);

    const naamInvoer =
        haalElementOp("instellingen-naam");

    if (naamInvoer) {
        naamInvoer.focus();
        naamInvoer.select();
    }
}