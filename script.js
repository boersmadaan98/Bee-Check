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

const opslagNaam = "bijenControleAppGegevens";


// ========================================
// STANDAARDGEGEVENS
// ========================================

const standaardBijenkasten = [
    {
        id: 1,
        naam: "Kast 1",
        locatie: "Achtertuin",
        foto: null,

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
        bakken: 2,
        koninginkleur: "Wit",
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
        foto: null,

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
        bakken: 1,
        koninginkleur: "Onbekend",
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
        foto: null,

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
        bakken: 3,
        koninginkleur: "Blauw",
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

        if (!opgeslagenGegevens) {
            return maakKopie(standaardBijenkasten);
        }

        const gegevens = JSON.parse(opgeslagenGegevens);

        if (!Array.isArray(gegevens)) {
            return maakKopie(standaardBijenkasten);
        }

        return gegevens;
    } catch (fout) {
        console.error(
            "De opgeslagen gegevens konden niet worden geladen:",
            fout
        );

        return maakKopie(standaardBijenkasten);
    }
}

function bewaarGegevens() {
    try {
        localStorage.setItem(
            opslagNaam,
            JSON.stringify(bijenkasten)
        );
    } catch (fout) {
        console.error(
            "De gegevens konden niet worden opgeslagen:",
            fout
        );

        alert(
            "De gegevens konden niet worden opgeslagen. " +
            "De gekozen foto is mogelijk te groot."
        );
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

function maakVeiligeTekst(tekst) {
    const tijdelijkElement =
        document.createElement("div");

    tijdelijkElement.textContent =
        tekst ?? "";

    return tijdelijkElement.innerHTML;
}


// ========================================
// HOMEPAGINA EN KASTENOVERZICHT
// ========================================

function toonKastenOverzicht() {
    const kastenLijst =
        haalElementOp("kasten-lijst");

    if (!kastenLijst) {
        return;
    }

    kastenLijst.innerHTML = "";

    bijenkasten.forEach((kast) => {
        const kaart =
            document.createElement("button");

        kaart.type = "button";
        kaart.className = "kast-keuzekaart";

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

                <span class="kaart-pijl">
                    ›
                </span>

            </div>
        `;

        kaart.addEventListener(
            "click",
            function () {
                openKast(kast.id);
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
        kast.dagenGeleden
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
        kast.volgendeActie
    );

    zetTekst(
        "controle-datum",
        kast.laatsteControle
    );

    zetTekst(
        "controle-temperament",
        kast.temperament
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
        "detail-bakken",
        kast.bakken
    );

    zetTekst(
        "detail-koninginkleur",
        kast.koninginkleur
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
// CONTROLEFORMULIER OPENEN
// ========================================

function openControleFormulier() {
    const kast = haalActieveKastOp();

    if (!kast) {
        alert("Open eerst een bijenkast.");
        return;
    }

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

    stelInvoerWaardeIn(
        "invoer-volgende-actie",
        kast.volgendeActie
    );

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

function slaControleOp(event) {
    event.preventDefault();

    const kast = haalActieveKastOp();

    if (!kast) {
        return;
    }

    const seizoen =
        haalSeizoensgegevensOp(kast);

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

    const nieuweNotities =
        leesInvoerWaarde(
            "invoer-notities",
            ""
        ).trim();

    kast.notities =
        nieuweNotities ||
        "Geen notities toegevoegd.";

    const volgendeActie =
        leesInvoerWaarde(
            "invoer-volgende-actie",
            ""
        ).trim();

    kast.volgendeActie =
        volgendeActie ||
        "Nog geen volgende actie bepaald.";

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

    kast.dagenGeleden = "Vandaag";

    if (!Array.isArray(kast.historie)) {
        kast.historie = [];
    }

    kast.historie.unshift({
        datum: kast.laatsteControle,
        status: kast.status,

        notitie:
            `${kast.ramenBezet} ramen bezet, ` +
            `${kast.ramenBrias} ramen BRIAS. ` +
            kast.notities
    });

    bewaarGegevens();
    toonKastenOverzicht();
    openKast(kast.id);
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

    historie.forEach((controle) => {
        const kaart =
            document.createElement("article");

        kaart.className =
            "historie-kaart";

        kaart.innerHTML = `
            <div class="historie-kop">

                <strong>
                    ${maakVeiligeTekst(controle.datum)}
                </strong>

                <span class="historie-status">
                    ${maakVeiligeTekst(controle.status)}
                </span>

            </div>

            <p>
                ${maakVeiligeTekst(controle.notitie)}
            </p>
        `;

        controleHistorie.appendChild(kaart);
    });
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
    const kast = bijenkasten.find(
        (item) =>
            item.id === Number(kastId)
    );

    if (!kast) {
        return;
    }

    stelInvoerWaardeIn(
        "instellingen-naam",
        kast.naam
    );

    stelInvoerWaardeIn(
        "instellingen-locatie",
        kast.locatie
    );

    tijdelijkeKastFoto =
        kast.foto || null;

    toonFotoPreview(
        tijdelijkeKastFoto
    );

    const fotoInvoer =
        haalElementOp("instellingen-foto");

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

    kast.naam = nieuweNaam;
    kast.locatie = nieuweLocatie;
    kast.foto = tijdelijkeKastFoto;

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

function activeerKnoppen() {
    activeerKnop(
        "terug-knop",
        "click",
        function () {
            verbergScherm("kast-detail");
            verbergScherm(
                "controle-formulier-scherm"
            );
            toonScherm("kasten-overzicht");

            actieveKastId = null;

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
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
        bakken: 1,
        koninginkleur: "Onbekend",
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