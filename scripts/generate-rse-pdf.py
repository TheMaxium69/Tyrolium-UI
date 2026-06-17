#!/usr/bin/env python3
from fpdf import FPDF
from fpdf.enums import XPos, YPos
import os

OUTPUT = os.path.join(os.path.dirname(__file__), "../dist/tyrolium-rse.pdf")

SFNS        = "/System/Library/Fonts/SFNS.ttf"
SFNS_ITALIC = "/System/Library/Fonts/SFNSItalic.ttf"
ARIAL_UNI   = "/Library/Fonts/Arial Unicode.ttf"

# ── Palette ──────────────────────────────────────────────────────────────────
BLUE    = (13,  27,  57)
ACCENT  = (59, 130, 246)
LIGHT   = (246, 247, 251)
TEXT    = (30,  30,  40)
MUTED   = (100, 110, 130)
WHITE   = (255, 255, 255)
BORDER  = (220, 225, 235)

# ── Content ───────────────────────────────────────────────────────────────────
metrics = [
    ("2017",  "Fondée en"),
    ("100%",  "Données hébergées en France"),
    ("5+",    "Partenaires académiques"),
    ("8+",    "Filiales & projets"),
]

commitments = [
    (
        "Souveraineté numérique",
        "Nos serveurs, nos données, notre code : tout reste sur le territoire français. "
        "Chez Tyrolium, refuser la dépendance aux géants étrangers n'est pas une posture — c'est une conviction.",
    ),
    (
        "Mérite & excellence",
        "Nous croyons que la qualité prime sur la quantité, et que l'excellence se construit "
        "par le travail et l'exigence. Chaque projet porte la marque d'un savoir-faire forgé dans la durée.",
    ),
    (
        "Ancrage territorial",
        "Tyrolium est né en France, grandit en France et investit dans les régions françaises. "
        "Nos partenariats avec Auvergne-Rhône-Alpes et le Grand-Est témoignent d'un engagement "
        "concret pour les territoires.",
    ),
    (
        "Emploi & formation locale",
        "Nous privilégions le recrutement local et les partenariats avec des écoles françaises. "
        "Former les talents de demain sur notre sol, c'est renforcer l'indépendance technologique du pays.",
    ),
    (
        "Entrepreneuriat & transmission",
        "À travers notre incubateur, nous accompagnons des entrepreneurs qui veulent bâtir quelque "
        "chose de solide et de durable. Transmettre une culture du travail bien fait, c'est aussi notre mission.",
    ),
    (
        "Pérennité & indépendance",
        "Tyrolium se finance par son activité, pas par des subventions. Notre indépendance financière "
        "est une garantie de liberté : pas d'investisseur étranger, pas de pression externe, pas de "
        "compromis sur nos convictions.",
    ),
]

initiatives = [
    (
        "Incubateur Tyrolium", "Actif",
        "Un programme d'accompagnement destiné aux porteurs de projets tech qui partagent nos valeurs : "
        "exigence, indépendance et ambition française. Nous apportons réseau, expertise et infrastructure.",
    ),
    (
        "Formation & mentorat", "Partenariats",
        "En partenariat avec Simplon, Ynov et Human Booster, Tyrolium ouvre ses portes aux étudiants "
        "et aux reconvertis. Parce qu'une nation forte en technologie se construit par ses hommes et ses femmes.",
    ),
    (
        "Infrastructure souveraine", "SolidServ",
        "SolidServ, notre branche hébergement, propose des solutions 100% françaises pour les entreprises "
        "qui refusent de confier leurs données à des plateformes étrangères soumises à des législations extérieures.",
    ),
    (
        "Des comptes universels français", "Useritium",
        "Développé en France, hébergé en France, conçu pour les Français : Useritium est notre réponse "
        "souveraine aux comptes universels imposés par les grandes plateformes étrangères. "
        "Vos données vous appartiennent — et elles restent sur notre sol.",
    ),
]


class RSEPDF(FPDF):

    def header(self):
        pass

    def footer(self):
        self.set_y(-14)
        self._font("R", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 10, f"Tyrolium — Document RSE — Page {self.page_no()}", align="C")

    def _font(self, style="R", size=10):
        mapping = {"R": "sfns", "B": "sfns-bold", "I": "sfns-italic"}
        self.set_font(mapping.get(style, "sfns"), size=size)

    # ── helpers ──────────────────────────────────────────────────────────────

    def label(self, text):
        self._font("B", 8)
        self.set_text_color(*ACCENT)
        self.cell(0, 6, text.upper(), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    def h2(self, text, size=16):
        self._font("B", size)
        self.set_text_color(*BLUE)
        self.multi_cell(0, 8, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)

    def body(self, text, size=10):
        self._font("R", size)
        self.set_text_color(*TEXT)
        self.multi_cell(0, 5.5, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

    def guard(self, h):
        if self.get_y() + h > self.h - self.b_margin - 15:
            self.add_page()

    # ── sections ─────────────────────────────────────────────────────────────

    def draw_hero(self):
        self.set_fill_color(*BLUE)
        self.rect(0, 0, self.w, 72, "F")

        self.set_y(14)
        self._font("B", 9)
        self.set_text_color(*ACCENT)
        self.cell(0, 6, "RSE", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        self._font("B", 26)
        self.set_text_color(*WHITE)
        self.cell(0, 12, "Nos Responsabilités", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        self._font("R", 9.5)
        self.set_text_color(195, 210, 235)
        self.multi_cell(
            0, 5.5,
            "La technologie au service de la nation — l'engagement de Tyrolium pour\n"
            "une France numérique souveraine, méritocratique et responsable.",
            align="C",
            new_x=XPos.LMARGIN, new_y=YPos.NEXT,
        )
        self.set_y(80)

    def draw_intro(self):
        self.label("Notre vision")
        self.h2("Une holding technologique les pieds sur terre")
        self.body(
            "Tyrolium n'a pas été construit dans un garage de la Silicon Valley. Il a été construit "
            "ici, en France, par des gens qui croient que la souveraineté technologique d'une nation "
            "n'est pas négociable. Nous n'avons aucune leçon à recevoir de ceux qui ont externalisé "
            "leurs données, leurs talents et leurs infrastructures à des puissances étrangères."
        )
        self.body(
            "Notre RSE n'est pas un exercice de communication. C'est une posture quotidienne : "
            "recruter local, former rigoureusement, construire durablement et investir dans les "
            "territoires français."
        )

        # Quote
        self.ln(2)
        qx = self.l_margin + 4
        qw = self.w - self.l_margin - self.r_margin - 8
        qy = self.get_y()
        self.set_draw_color(*ACCENT)
        self.set_line_width(1.5)
        self.line(qx, qy, qx, qy + 14)
        self.set_xy(qx + 6, qy + 2)
        self._font("I", 11)
        self.set_text_color(*BLUE)
        self.multi_cell(qw - 6, 6,
                        "“l'excellence n'est pas un privilège — c'est une exigence.”",
                        new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(8)

    def draw_metrics(self):
        self.guard(36)
        col_w = (self.w - self.l_margin - self.r_margin) / 4
        x0 = self.l_margin
        y0 = self.get_y()

        for i, (val, lbl) in enumerate(metrics):
            x = x0 + i * col_w
            self.set_fill_color(*BLUE)
            self.rect(x + 1, y0, col_w - 2, 30, "F")

            self.set_xy(x + 1, y0 + 5)
            self._font("B", 18)
            self.set_text_color(*WHITE)
            self.cell(col_w - 2, 9, val, align="C")

            self.set_xy(x + 1, y0 + 16)
            self._font("R", 7.5)
            self.set_text_color(180, 200, 230)
            self.multi_cell(col_w - 2, 4, lbl, align="C")

        self.set_y(y0 + 38)

    def draw_commitments(self):
        self.ln(4)
        self.label("Nos valeurs")
        self.h2("Six engagements")

        col_w = (self.w - self.l_margin - self.r_margin - 5) / 2
        card_h = 58

        for idx, (title, desc) in enumerate(commitments):
            col = idx % 2
            if col == 0:
                self.guard(card_h + 4)
                ry = self.get_y()
                lx = self.l_margin
                rx = self.l_margin + col_w + 5
                self._draw_commit_card(lx, ry, col_w, card_h, title, desc)
            else:
                self._draw_commit_card(rx, ry, col_w, card_h, title, desc)
                self.set_y(ry + card_h + 5)

        if len(commitments) % 2 == 1:
            self.set_y(ry + card_h + 5)

    def _draw_commit_card(self, x, y, w, h, title, desc):
        self.set_fill_color(*WHITE)
        self.set_draw_color(*BORDER)
        self.set_line_width(0.25)
        self.rect(x, y, w, h, "FD")

        self.set_fill_color(*ACCENT)
        self.rect(x, y, w, 3, "F")

        self.set_xy(x + 5, y + 7)
        self._font("B", 10)
        self.set_text_color(*BLUE)
        self.cell(w - 10, 6, title)

        self.set_xy(x + 5, y + 15)
        self._font("R", 8.5)
        self.set_text_color(*TEXT)
        self.multi_cell(w - 10, 4.5, desc)

    def draw_initiatives(self):
        self.ln(6)
        self.guard(20)
        self.label("En pratique")
        self.h2("Nos initiatives")

        for title, badge, desc in initiatives:
            self.guard(30)
            y0 = self.get_y()
            pw = self.w - self.l_margin - self.r_margin

            # Left blue strip
            self.set_fill_color(*ACCENT)
            self.rect(self.l_margin, y0, 3.5, 32, "F")

            # Badge
            self._font("B", 8)
            bw = self.get_string_width(badge) + 10
            bx = self.l_margin + pw - bw
            self.set_fill_color(*BLUE)
            self.set_text_color(*WHITE)
            self.rect(bx, y0 + 3, bw, 7, "F")
            self.set_xy(bx, y0 + 3)
            self.cell(bw, 7, badge, align="C")

            # Title
            self.set_xy(self.l_margin + 8, y0 + 4)
            self._font("B", 11)
            self.set_text_color(*BLUE)
            self.cell(pw - bw - 10, 7, title)

            # Desc
            self.set_xy(self.l_margin + 8, y0 + 14)
            self._font("R", 9)
            self.set_text_color(*TEXT)
            self.multi_cell(pw - 10, 5, desc, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            self.ln(5)

    def draw_footer_note(self):
        self.ln(4)
        self.guard(18)
        y0 = self.get_y()
        pw = self.w - self.l_margin - self.r_margin
        self.set_fill_color(*LIGHT)
        self.rect(self.l_margin, y0, pw, 16, "F")
        self.set_xy(self.l_margin + 5, y0 + 4)
        self._font("I", 9)
        self.set_text_color(*MUTED)
        self.multi_cell(
            pw - 8, 5,
            "Tyrolium est une entreprise française. "
            "L'intégralité de nos données est hébergée exclusivement sur des infrastructures françaises.",
            new_x=XPos.LMARGIN, new_y=YPos.NEXT,
        )


def build():
    pdf = RSEPDF("P", "mm", "A4")
    pdf.set_auto_page_break(True, margin=18)
    pdf.set_margins(18, 10, 18)

    # Register Unicode fonts
    pdf.add_font("sfns",        fname=SFNS,        uni=True)
    pdf.add_font("sfns-italic", fname=SFNS_ITALIC, uni=True)
    # Bold: SFNS is a variable font but fpdf2 treats it as regular; use it for bold too
    # (visual difference is achieved via size)
    pdf.add_font("sfns-bold",   fname=SFNS,        uni=True)

    pdf.add_page()
    pdf.draw_hero()
    pdf.draw_intro()
    pdf.draw_metrics()
    pdf.draw_commitments()
    pdf.draw_initiatives()
    pdf.draw_footer_note()

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    pdf.output(OUTPUT)
    print(f"PDF généré : {OUTPUT}")


if __name__ == "__main__":
    build()
