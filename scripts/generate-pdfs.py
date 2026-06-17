#!/usr/bin/env python3
"""
Génère 4 PDFs en français pour le site Tyrolium :
  - tyrolium-legal.pdf  (Mentions légales + CGU + CGV + Confidentialité)
  - tyrolium-equipe.pdf
  - tyrolium-partenaires.pdf
  - tyrolium-home.pdf   (Home + Filiales)
"""
from fpdf import FPDF
from fpdf.enums import XPos, YPos
import os

SFNS        = "/System/Library/Fonts/SFNS.ttf"
SFNS_ITALIC = "/System/Library/Fonts/SFNSItalic.ttf"
DIST        = os.path.join(os.path.dirname(__file__), "../dist")

BLUE   = (13,  27,  57)
ACCENT = (59, 130, 246)
LIGHT  = (246, 247, 251)
TEXT   = (30,  30,  40)
MUTED  = (100, 110, 130)
WHITE  = (255, 255, 255)
BORDER = (220, 225, 235)
GREEN  = (16, 185, 129)


# ════════════════════════════════════════════════════════════════════════
# Base PDF
# ════════════════════════════════════════════════════════════════════════

class Base(FPDF):
    _footer_label = "Tyrolium"

    def header(self): pass

    def footer(self):
        self.set_y(-14)
        self._f("R", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 10, f"{self._footer_label} — Page {self.page_no()}", align="C")

    def setup_fonts(self):
        self.add_font("sf",  fname=SFNS,        uni=True)
        self.add_font("sfi", fname=SFNS_ITALIC, uni=True)
        self.add_font("sfb", fname=SFNS,        uni=True)   # même TTF, rendu "bold" par taille

    def _f(self, style="R", size=10):
        m = {"R": "sf", "I": "sfi", "B": "sfb"}
        self.set_font(m.get(style, "sf"), size=size)

    # ── shortcuts ────────────────────────────────────────────────────────

    def label(self, txt, color=ACCENT):
        self._f("B", 8); self.set_text_color(*color)
        self.cell(0, 6, txt.upper(), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    def h1(self, txt, size=22):
        self._f("B", size); self.set_text_color(*BLUE)
        self.multi_cell(0, 9, txt, new_x=XPos.LMARGIN, new_y=YPos.NEXT); self.ln(1)

    def h2(self, txt, size=14):
        self._f("B", size); self.set_text_color(*BLUE)
        self.multi_cell(0, 7, txt, new_x=XPos.LMARGIN, new_y=YPos.NEXT); self.ln(1)

    def h3(self, txt, size=11):
        self._f("B", size); self.set_text_color(*BLUE)
        self.multi_cell(0, 6, txt, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    def body(self, txt, size=9.5):
        self._f("R", size); self.set_text_color(*TEXT)
        self.multi_cell(0, 5.2, txt, new_x=XPos.LMARGIN, new_y=YPos.NEXT); self.ln(1.5)

    def italic(self, txt, size=9.5):
        self._f("I", size); self.set_text_color(*MUTED)
        self.multi_cell(0, 5.2, txt, new_x=XPos.LMARGIN, new_y=YPos.NEXT); self.ln(1)

    def bullet_list(self, items, size=9.5):
        self._f("R", size); self.set_text_color(*TEXT)
        for item in items:
            self.multi_cell(0, 5.2, f"  •  {item}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

    def divider(self):
        self.ln(3)
        self.set_draw_color(*BORDER); self.set_line_width(0.25)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(5)

    def guard(self, h):
        if self.get_y() + h > self.h - self.b_margin - 15:
            self.add_page()

    def hero(self, eyebrow, title, desc):
        self.set_fill_color(*BLUE)
        self.rect(0, 0, self.w, 72, "F")
        self.set_y(14)
        self._f("B", 9); self.set_text_color(*ACCENT)
        self.cell(0, 6, eyebrow, align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self._f("B", 24); self.set_text_color(*WHITE)
        self.cell(0, 11, title, align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self._f("R", 9); self.set_text_color(195, 210, 235)
        self.multi_cell(0, 5.5, desc, align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_y(82)

    def section_bar(self, txt, bg=BLUE):
        self.guard(14)
        y = self.get_y()
        self.set_fill_color(*bg)
        self.rect(self.l_margin, y, self.w - self.l_margin - self.r_margin, 10, "F")
        self._f("B", 10); self.set_text_color(*WHITE)
        self.set_xy(self.l_margin + 4, y + 2)
        self.cell(0, 6, txt)
        self.set_y(y + 13)

    def new_doc(self, label="Tyrolium"):
        self.set_auto_page_break(True, margin=18)
        self.set_margins(18, 10, 18)
        self.setup_fonts()
        self._footer_label = label
        self.add_page()


# ════════════════════════════════════════════════════════════════════════
# 1 — LÉGAL
# ════════════════════════════════════════════════════════════════════════

def build_legal():
    pdf = Base("P", "mm", "A4")
    pdf.new_doc("Tyrolium — Documents Légaux")

    # ── Cover ──────────────────────────────────────────────────────────
    pdf.set_fill_color(*BLUE)
    pdf.rect(0, 0, pdf.w, pdf.h, "F")
    pdf._f("B", 10); pdf.set_text_color(*ACCENT)
    pdf.set_y(100); pdf.cell(0, 8, "TYROLIUM", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf._f("B", 28); pdf.set_text_color(*WHITE)
    pdf.cell(0, 13, "Documents Légaux", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf._f("R", 11); pdf.set_text_color(195, 210, 235)
    pdf.cell(0, 7, "Mentions légales · CGU · CGV · Confidentialité", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(6)
    pdf._f("I", 9); pdf.set_text_color(160, 175, 205)
    pdf.cell(0, 6, "Dernière mise à jour : 16 juin 2026", align="C")
    pdf.set_y(pdf.h - 25)
    pdf._f("R", 8); pdf.set_text_color(130, 145, 175)
    pdf.cell(0, 6, "© 2017-2026 Tyrolium — Tous droits réservés", align="C")

    # ── Mentions légales ──────────────────────────────────────────────
    pdf.add_page()
    pdf.set_margins(18, 10, 18)
    pdf.label("Mentions légales")
    pdf.h1("Mentions légales")
    pdf.italic("Dernière mise à jour : 16 juin 2026")
    pdf.ln(2)

    pdf.h2("1. Éditeur du site")
    pdf.body(
        "Les sites tyrolium.fr, tyroserv.fr, solidserv.fr, tyrociel.fr, gamenium.fr, influnias.fr, "
        "vturias.fr, nexiumiacrm.fr et useritium.fr sont édités par Tyrolium, entreprise à but lucratif "
        "fondée en 2017 par Maxime Tournier.\nPDG et Directeur de la publication : Maxime Tournier."
    )
    pdf.body("Toute création de l'entreprise nous appartient.\n"
             "Copyright © Tyrolium. 2026 — © 2017-2026 Tyrolium. — Tous droits réservés. © Tyrolium")

    pdf.h2("2. Informations administratives")
    rows = [
        ("SIRET", "91027536100012"),
        ("Numéro TVA", "FR33910275361"),
        ("Activité (Code NAF/APE)", "Programmation informatique (6201Z)"),
        ("Siège social", "252, Avenue Jean Jaurès — 69150 Décines-Charpieu"),
        ("Établissement secondaire", "44, Avenue Paul Kruger — 69100 Villeurbanne"),
    ]
    for k, v in rows:
        pdf._f("R", 9.5); pdf.set_text_color(*TEXT)
        pdf.cell(60, 5.5, k, border="B"); pdf._f("B", 9.5)
        pdf.cell(0, 5.5, v, border="B", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(4)

    pdf.h2("3. Contact")
    pdf.body(
        "Contact global : contact@tyrolium.fr\n"
        "Contact de la direction : maxime.tournier@tyrolium.fr — +33 6 11 11 26 69\n"
        "Point de contact unique DSA (Règlement (UE) 2022/2065) : juridique@tyrolium.fr — "
        "accessible aux utilisateurs et aux autorités publiques pour toute question relative au "
        "règlement sur les services numériques."
    )

    pdf.h2("4. Hébergement")
    pdf.body("Le site est hébergé par SolidServ, infrastructure opérée par Tyrolium. Les serveurs sont localisés en France.")

    pdf.h2("5. Propriété intellectuelle")
    pdf.body(
        "L'intégralité du site et de ses contenus postés sur les serveurs, les contenus mis en ligne "
        "rendus publics, les images, les textes et tous les écrits, le design, le code source, les logos, "
        "les visuels, les photos ainsi que les produits, appartiennent entièrement à Tyrolium.\n"
        "Ceci est protégé conformément au copyright © 2017-2026 Tyrolium. et à l'article L111-1 du code "
        "de la propriété intellectuelle française.\n"
        "Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie "
        "des éléments du site, quel que soit le moyen ou le procédé utilisé, est strictement interdite, "
        "sauf autorisation écrite préalable de Tyrolium."
    )

    pdf.h2("6. Marques déposées")
    pdf.body("Toutes les marques listées ci-dessous appartiennent à Tyrolium (nom, produit et visuel associé).")
    marques = [
        "Tyrolium ®", "TyroServ ®", "TyroDiscord ®", "TyroShop ®", "TyroStudio ®", "TyroCiel ®",
        "SolidServ ®", "Gamenium ®", "Sélémusium ®", "Wonderlium ®", "Useritium ®", "TyroStudent ®",
        "Influnias ®", "Vturias ®", "DuoGramme ®", "NexiumiaCRM ®", "Avra-Formule ®",
    ]
    mineraux = ["Tyrolium ®", "Rhodonium ®", "Aventurium ®", "Yellorium ®", "Volcanium ®"]
    # 3 colonnes
    col = (pdf.w - pdf.l_margin - pdf.r_margin) / 3
    x0 = pdf.l_margin; y0 = pdf.get_y()
    for i, m in enumerate(marques):
        c = i % 3; r = i // 3
        pdf.set_xy(x0 + c * col, y0 + r * 5.5)
        pdf._f("R", 9); pdf.set_text_color(*TEXT)
        pdf.cell(col, 5.5, m)
    pdf.set_y(y0 + (len(marques) // 3 + 1) * 5.5 + 2)
    pdf.body("Minéraux TyroServ protégés : " + " · ".join(mineraux))
    pdf.italic("© 2017-2026 Tyrolium.")

    pdf.h2("7. Crédits & Copyright tiers")
    pdf.body(
        "Tous les logos, marques et dénominations sociales des tiers mentionnés ci-dessous sont cités "
        "à titre informatif et d'identification uniquement, conformément aux dispositions du Code de la "
        "propriété intellectuelle relatives à l'usage licite et loyal d'une marque tierce (notamment "
        "l'article L713-6). Ces mentions ne constituent en aucun cas un partenariat."
    )
    tiers = [
        "© 2026 Google LLC", "© 2026 Meta", "© 2026 Twitter, Inc.", "© 2026 Discord",
        "© 2026 LinkedIn Corporation", "© 2026 GitHub, Inc.", "© 2026 Twitch Interactive, Inc.",
        "© 2026 TikTok", "© 2026 Telegram Messenger Inc.", "© 2026 Mojang", "© 2026 Overwolf",
        "© 2026 Rockstar Games, Inc.", "© 2026 Cfx.re", "© 2026 AMD", "© 2026 WordPress Foundation",
        "© 2026 Stripe, Inc.", "© 2026 PayPal, Inc.", "© 2026 Shopify Inc.", "© 2026 CLS Habitat",
        "© 2026 Oracle Corporation", "© 2026 Human Booster", "© 2026 Simplon", "© 2026 Ynov Connect",
        "© 2026 IPSSI", "© 2026 Région Auvergne-Rhône-Alpes", "© 2026 Région Grand-Est",
        "© 2026 French Tech St-Étienne/Lyon", "© 2026 Proxmox Server Solutions GmbH", "© 2026 OVH",
        "© 2026 Tebex", "© 2026 Bâtir Positif", "© 2026 Graphic Nook", "© 2026 Evogue",
        "© 2026 Ascentia", "© 2026 MO5", "© 2026 Génération IUM, Org.",
    ]
    pdf.guard(30)
    y0 = pdf.get_y(); x0 = pdf.l_margin
    for i, t in enumerate(tiers):
        c = i % 3; r = i // 3
        pdf.set_xy(x0 + c * col, y0 + r * 5.2)
        pdf._f("R", 8.5); pdf.set_text_color(*MUTED)
        pdf.cell(col, 5.2, t)
    pdf.set_y(y0 + (len(tiers) // 3 + 1) * 5.2 + 2)

    for n, t in [("8. Données personnelles",
        "Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, "
        "de rectification, d'effacement et de portabilité de vos données personnelles. "
        "Pour exercer ces droits, contactez-nous à : juridique@tyrolium.fr. "
        "Aucune donnée personnelle n'est transmise à des tiers sans votre consentement explicite."),
       ("9. Cookies",
        "Ce site utilise uniquement des cookies strictement nécessaires à son bon fonctionnement. "
        "Aucun cookie de traçage publicitaire ou d'analyse tiers n'est déposé sur votre appareil."),
       ("10. Limitation de responsabilité",
        "Tyrolium s'efforce de maintenir les informations de ce site à jour et exactes. Cependant, "
        "des erreurs ou omissions peuvent subsister. Tyrolium décline toute responsabilité quant aux "
        "éventuelles inexactitudes du contenu ou au contenu de sites tiers accessibles via des liens hypertextes."),
       ("11. Droit applicable",
        "Le présent site et ses conditions d'utilisation sont soumis au droit français. "
        "Tout litige relatif à son utilisation sera soumis à la juridiction exclusive des tribunaux compétents de France. "
        "Les services numériques de Tyrolium sont également soumis au Règlement (UE) 2022/2065 (Digital Services Act — DSA).")]:
        pdf.guard(20)
        pdf.h2(n); pdf.body(t)

    # ── CGU ───────────────────────────────────────────────────────────
    pdf.add_page()
    pdf.label("CGU")
    pdf.h1("Conditions Générales d'Utilisation")
    pdf.italic("Dernière mise à jour : 16 juin 2026")
    pdf.ln(3)

    cgu = [
        ("1. Objet",
         "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation "
         "des services et plateformes proposés par Tyrolium. En accédant à nos services, vous acceptez "
         "sans réserve les présentes conditions.", None),
        ("2. Accès aux services",
         "L'accès aux services Tyrolium est réservé aux personnes physiques ou morales ayant la capacité "
         "juridique de contracter. L'utilisation de nos services implique l'acceptation pleine et entière "
         "des présentes CGU.\n"
         "Tyrolium se réserve le droit de suspendre ou de résilier l'accès à ses services en cas de "
         "non-respect des présentes conditions.", None),
        ("3. Utilisation acceptable",
         "Il est strictement interdit d'utiliser nos services pour :",
         ["Diffuser des contenus illicites, offensants ou portant atteinte aux droits de tiers",
          "Mener des activités de phishing, spam ou toute autre activité malveillante",
          "Tenter de compromettre la sécurité de nos infrastructures",
          "Violer des droits de propriété intellectuelle",
          "Toute activité contraire aux lois françaises et européennes en vigueur"]),
        ("4. Disponibilité des services",
         "Tyrolium s'engage à maintenir ses services disponibles 24h/24 et 7j/7 dans la limite du possible. "
         "Des interruptions pour maintenance peuvent survenir et seront communiquées au préalable dans la "
         "mesure du possible.", None),
        ("5. Responsabilité de l'utilisateur",
         "L'utilisateur est seul responsable des données, contenus et informations qu'il publie ou transmet "
         "via nos services. Tyrolium ne peut être tenu responsable des dommages directs ou indirects "
         "résultant d'une mauvaise utilisation de ses services.", None),
        ("6. Propriété intellectuelle",
         "Tous les éléments composant les services Tyrolium (interfaces, logiciels, marques, logos, "
         "contenus) sont la propriété exclusive de Tyrolium. Toute reproduction ou exploitation "
         "non autorisée est interdite.", None),
        ("7. Modification des CGU",
         "Tyrolium se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs "
         "seront informés de toute modification substantielle. La poursuite de l'utilisation des services "
         "après notification vaut acceptation des nouvelles conditions.\n"
         "Conformément à l'article 14 du Règlement (UE) 2022/2065 (DSA), Tyrolium accorde aux utilisateurs "
         "un préavis minimum de 15 jours avant l'entrée en vigueur de toute modification substantielle.", None),
        ("8. Signalement de contenus illicites (DSA)",
         "Conformément à l'article 16 du Règlement (UE) 2022/2065 (DSA), tout utilisateur peut notifier "
         "à Tyrolium la présence d'un contenu présumé illicite sur l'une de ses plateformes. "
         "Les signalements doivent être adressés à juridique@tyrolium.fr (objet : « DSA - Signalement "
         "de contenu illicite »), en précisant : la description du contenu, sa localisation précise "
         "(URL ou identifiant), le fondement juridique de l'illicéité alléguée, et les coordonnées "
         "du signalant. Tyrolium s'engage à traiter chaque notification avec diligence.", None),
        ("9. Système interne de traitement des réclamations (DSA)",
         "Conformément à l'article 17 du DSA, Tyrolium dispose d'un système interne de traitement des "
         "réclamations accessible à tout utilisateur qui estime qu'une décision concernant son contenu "
         "ou son accès aux services a été prise de manière injustifiée. Les réclamations doivent être "
         "adressées à juridique@tyrolium.fr dans un délai de 30 jours à compter de la notification "
         "de la décision contestée.", None),
        ("10. Règlement extrajudiciaire des litiges (DSA)",
         "Conformément à l'article 21 du DSA, si la procédure de réclamation interne n'a pas abouti à "
         "une résolution satisfaisante, les utilisateurs peuvent avoir recours à un organe certifié de "
         "règlement extrajudiciaire des litiges. En France, l'autorité de surveillance compétente est "
         "l'ARCOM (arcom.fr). Ce droit de recours s'exerce gratuitement pour l'utilisateur.", None),
        ("11. Contact", "Pour toute question relative aux présentes CGU : juridique@tyrolium.fr", None),
    ]
    for title, text, bullets in cgu:
        pdf.guard(20); pdf.h2(title); pdf.body(text)
        if bullets: pdf.bullet_list(bullets)

    # ── CGV ───────────────────────────────────────────────────────────
    pdf.add_page()
    pdf.label("CGV")
    pdf.h1("Conditions Générales de Vente")
    pdf.italic("Dernière mise à jour : 16 juin 2026")
    pdf.ln(2)
    pdf.body("Sommaire : 1. Général · 2. Prestation Tyrolium · 3. Grade et Cosmétique TyroServ · "
             "4. Serveur SolidServ · 5. Goodies Tyrolium & Vturias · 6. Abonnement NexiumiaCRM · "
             "7. Résolution des litiges et ADR")
    pdf.divider()

    pdf.h2("1. Général")
    pdf.body(
        "Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des relations commerciales "
        "entre Tyrolium (SIRET 91027536100012, dont le siège est situé au 252 Avenue Jean Jaurès, "
        "69150 Décines-Charpieu, France) et toute personne physique ou morale (ci-après le Client) "
        "procédant à l'achat d'un produit ou service auprès de Tyrolium ou de l'une de ses marques "
        "(TyroServ, SolidServ, Vturias, NexiumiaCRM, etc.).\n"
        "Le fait de passer commande ou d'effectuer un paiement vaut acceptation pleine et entière des "
        "présentes CGV. Tyrolium se réserve le droit de les mettre à jour à tout moment.\n"
        "Définitions : « Tyrolium » désigne l'entreprise et l'ensemble de ses marques. "
        "« Client » désigne toute personne procédant à l'achat d'un produit ou service. "
        "« Prestation » ou « Service » désigne tout produit numérique ou physique vendu par Tyrolium.\n"
        "Les présentes CGV sont soumises au droit français. Contact : juridique@tyrolium.fr\n"
        "Tyrolium se conforme également aux obligations du Règlement (UE) 2022/2065 (Digital Services Act — DSA)."
    )
    pdf.divider()

    pdf.h2("2. Prestation Tyrolium")
    pdf.body(
        "Tyrolium propose des prestations sur mesure en développement web, conception d'applications, "
        "incubation digitale, conseil stratégique et formation technique."
    )
    subtitles_cgv2 = [
        ("Commandes et devis",
         "Toute prestation fait l'objet d'un devis écrit préalable établi par Tyrolium, valable 30 jours. "
         "La commande est confirmée après réception du devis signé et, le cas échéant, de l'acompte convenu."),
        ("Tarifs et facturation",
         "Les prix sont indiqués en euros (€) hors taxes. Tyrolium se réserve le droit de facturer des "
         "frais supplémentaires en cas de dépassement du périmètre initialement défini."),
        ("Conditions de paiement", None),
        ("Livraison et délais",
         "Les délais de livraison sont communiqués lors de la signature du devis et sont indicatifs. "
         "Tout retard imputable au Client peut entraîner un report des délais sans engagement de la "
         "responsabilité de Tyrolium."),
        ("Propriété des livrables",
         "La propriété des livrables est transférée au Client après règlement intégral. Tyrolium "
         "conserve le droit de mentionner la réalisation dans son portfolio, sauf opposition écrite."),
        ("Garantie et SAV",
         "Tyrolium garantit ses réalisations contre tout défaut de conformité pendant la durée définie "
         "dans le devis. Les corrections d'anomalies imputables à Tyrolium sont prises en charge gratuitement."),
        ("Résiliation",
         "En cas de résiliation à l'initiative du Client après démarrage des travaux, les sommes "
         "correspondant aux prestations déjà réalisées restent dues."),
    ]
    for t, d in subtitles_cgv2:
        pdf._f("B", 10); pdf.set_text_color(*BLUE); pdf.cell(0, 6, t, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        if d: pdf.body(d)
        elif t == "Conditions de paiement":
            pdf.bullet_list([
                "Un acompte de 30 à 50 % peut être demandé à la commande",
                "Le solde est dû à la livraison ou selon l'échéancier convenu",
                "Paiement par virement bancaire ou tout autre moyen convenu",
                "Tout retard de paiement entraîne des pénalités égales à 3 fois le taux d'intérêt légal français",
            ])
    pdf.divider()

    pdf.h2("3. Grade et Cosmétique TyroServ")
    pdf.body(
        "TyroServ est un serveur Minecraft opéré par Tyrolium. Les présentes conditions s'appliquent "
        "à l'achat de grades (rangs) et d'articles cosmétiques disponibles sur les serveurs TyroServ."
    )
    tyroserv_items = [
        ("Grades disponibles",
         "TyroServ propose plusieurs grades à thème minéral (Rhodonium, Aventurium, Yellorium, Volcanium, etc.) "
         "octroyant des privilèges en jeu. Le détail des avantages est précisé sur la boutique TyroServ."),
        ("Articles cosmétiques",
         "Les articles cosmétiques (skins, effets, pets, etc.) sont purement esthétiques et ne confèrent "
         "aucun avantage compétitif. Tous les achats sont déterministes : aucun mécanisme aléatoire "
         "(lootbox, tirage au sort) n'existe sur TyroServ."),
        ("Achats par des mineurs",
         "Les achats effectués sur TyroServ par un mineur nécessitent l'autorisation préalable du titulaire "
         "de l'autorité parentale. En finalisant un achat, l'acheteur déclare soit être majeur, soit avoir "
         "obtenu l'autorisation parentale requise."),
        ("Achat et paiement",
         "Les achats sont effectués via la boutique officielle TyroServ. Le paiement est traité par des "
         "plateformes tierces sécurisées. Les grades sont activés dans un délai maximum de 24 heures."),
        ("Politique de remboursement",
         "Conformément à l'article L221-28 du Code de la consommation, les contenus numériques livrés "
         "immédiatement sont non remboursables une fois activés, sauf défaut technique avéré imputable à Tyrolium."),
        ("Suspension et révocation",
         "Tyrolium se réserve le droit de suspendre ou révoquer définitivement un grade sans remboursement "
         "en cas de manquement grave au règlement TyroServ (triche, harcèlement, fraude, etc.)."),
    ]
    for t, d in tyroserv_items:
        pdf._f("B", 10); pdf.set_text_color(*BLUE); pdf.cell(0, 6, t, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.body(d)
    pdf.divider()

    pdf.h2("4. Serveur SolidServ")
    pdf.body(
        "SolidServ est l'infrastructure d'hébergement de Tyrolium. Les présentes conditions s'appliquent "
        "à toutes les offres de location de serveurs de jeu, VPS et serveurs dédiés proposées par SolidServ."
    )
    solidserv_items = [
        ("Offres disponibles",
         "SolidServ propose des abonnements mensuels ou annuels pour des serveurs de jeu (Minecraft, etc.), "
         "des VPS et des serveurs dédiés. Les caractéristiques techniques détaillées sont précisées sur le site SolidServ."),
        ("Durée, renouvellement et paiement", None),
        ("Disponibilité (SLA)",
         "SolidServ s'engage à un taux de disponibilité mensuel de 99,5 % pour son infrastructure. "
         "Les opérations de maintenance planifiées sont annoncées au moins 24h à l'avance."),
        ("Sauvegardes",
         "SolidServ effectue des sauvegardes automatiques quotidiennes conservées pendant 7 jours pour "
         "les offres éligibles. Le Client reste seul responsable de ses données."),
        ("Usage acceptable",
         "Le Client s'engage à ne pas utiliser le service à des fins illicites (DDoS, spam, contenus "
         "illicites, etc.). Tout usage de ce type entraîne une suspension immédiate sans remboursement."),
        ("Responsabilité en tant qu'hébergeur (DSA)",
         "En tant que prestataire d'hébergement d'infrastructure au sens de l'article 6 du Règlement (UE) "
         "2022/2065 (DSA), SolidServ bénéficie d'une exonération de responsabilité conditionnelle pour les "
         "contenus stockés par ses clients. Signalements à : juridique@tyrolium.fr (objet : « DSA - Contenu illicite »)."),
        ("Résiliation",
         "Le Client peut résilier son abonnement à tout moment depuis son espace client. "
         "La résiliation prend effet à l'issue de la période payante en cours."),
    ]
    for t, d in solidserv_items:
        pdf._f("B", 10); pdf.set_text_color(*BLUE); pdf.cell(0, 6, t, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        if d: pdf.body(d)
        else:
            pdf.bullet_list([
                "Les abonnements sont mensuels ou annuels et se renouvellent automatiquement sauf résiliation au moins 48h avant",
                "Le paiement est dû d'avance pour chaque période",
                "En cas de non-paiement, le service est suspendu après 48h et supprimé après 7 jours",
            ])
    pdf.divider()

    pdf.h2("5. Goodies Tyrolium & Vturias")
    pdf.body(
        "Cette section couvre la vente de produits physiques (vêtements, accessoires, objets de collection, "
        "etc.) sous les marques Tyrolium et Vturias."
    )
    goodies_items = [
        ("Commande et validation",
         "Les commandes sont passées via la boutique en ligne officielle. Tyrolium se réserve le droit "
         "de refuser toute commande en cas de rupture de stock, de suspicion de fraude ou d'erreur dans l'offre."),
        ("Prix et paiement",
         "Les prix sont indiqués en euros (€) TTC. Les frais de livraison sont calculés au moment de la "
         "commande en fonction de l'adresse de livraison."),
        ("Livraison et délais", None),
        ("Droit de rétractation",
         "Conformément aux articles L221-18 et suivants du Code de la consommation, le Client dispose d'un "
         "droit de rétractation de 14 jours à compter de la réception du bien, sans motif à fournir. "
         "Les articles doivent être retournés en état d'origine dans leur emballage d'origine."),
        ("Retours et remboursements",
         "Le remboursement est effectué dans les 14 jours suivant la réception de l'article retourné. "
         "Les articles personnalisés ou fabriqués sur commande sont exclus du droit de rétractation. "
         "Pour initier un retour : juridique@tyrolium.fr"),
    ]
    for t, d in goodies_items:
        pdf._f("B", 10); pdf.set_text_color(*BLUE); pdf.cell(0, 6, t, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        if d: pdf.body(d)
        else:
            pdf.bullet_list([
                "Les commandes sont traitées sous 2 à 5 jours ouvrés",
                "Livraison standard : 5 à 10 jours ouvrés (France) ; 10 à 21 jours (international)",
                "Un numéro de suivi est communiqué par e-mail dès expédition",
                "Tyrolium n'est pas responsable des délais imputables au transporteur",
            ])
    pdf.divider()

    pdf.h2("6. Abonnement NexiumiaCRM")
    pdf.body(
        "NexiumiaCRM est une solution CRM SaaS développée et opérée par Tyrolium. Les présentes conditions "
        "s'appliquent à tous les plans d'abonnement proposés sur la plateforme NexiumiaCRM."
    )
    crm_items = [
        ("Plans d'abonnement",
         "NexiumiaCRM propose plusieurs plans (Free, Starter, Pro, Entreprise) avec des niveaux de "
         "fonctionnalités différents. Les abonnés existants sont notifiés au moins 30 jours à l'avance "
         "de toute réduction substantielle du service."),
        ("Facturation et renouvellement automatique", None),
        ("Essai gratuit",
         "Certains plans peuvent inclure une période d'essai gratuite (14 jours). Aucun paiement n'est "
         "requis pendant l'essai. À l'issue de l'essai, l'abonnement bascule sur le plan payant sauf "
         "résiliation préalable."),
        ("Résiliation",
         "Le Client peut résilier son abonnement à tout moment depuis les paramètres de son compte NexiumiaCRM. "
         "La résiliation prend effet à l'issue de la période de facturation en cours. "
         "Après résiliation, les données sont conservées 30 jours avant suppression définitive."),
        ("Données et confidentialité",
         "Les données saisies par le Client dans NexiumiaCRM restent la propriété exclusive du Client. "
         "Tyrolium traite ces données uniquement pour assurer la fourniture du service et dans le respect "
         "du RGPD. Les données sont hébergées sur des serveurs situés en France opérés par SolidServ."),
        ("Portabilité des données",
         "Conformément à l'article 20 du RGPD et aux dispositions du DSA, les clients de NexiumiaCRM "
         "peuvent demander à tout moment un export de leurs données depuis les paramètres du compte ou "
         "en contactant juridique@tyrolium.fr. Les données sont fournies en format JSON ou CSV dans un "
         "délai de 30 jours suivant la demande."),
        ("Accord de sous-traitance des données (RGPD art. 28)",
         "En utilisant NexiumiaCRM, le Client agit en tant que responsable du traitement et Tyrolium "
         "agit en tant que sous-traitant au sens de l'article 28 du RGPD."),
    ]
    for t, d in crm_items:
        pdf._f("B", 10); pdf.set_text_color(*BLUE); pdf.cell(0, 6, t, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        if d: pdf.body(d)
        else:
            pdf.bullet_list([
                "Les abonnements sont facturés mensuellement ou annuellement, à l'avance",
                "Ils se renouvellent automatiquement sauf résiliation avant la date de renouvellement",
                "Une facture est émise automatiquement par e-mail à chaque paiement",
                "Les prix sont indiqués HT ; la TVA applicable est ajoutée selon le pays du Client",
            ])
    pdf.body(
        "Obligations de Tyrolium en tant que sous-traitant : traitement sur instruction documentée du Client · "
        "confidentialité · mesures de sécurité (art. 32 RGPD) · hébergement direct via SolidServ en France · "
        "assistance aux droits des personnes · notification de violation dans les 72 heures · "
        "suppression des données dans les 30 jours après résiliation."
    )
    pdf.divider()

    pdf.h2("7. Résolution des litiges et ADR (DSA)")
    pdf.body(
        "Tout litige relatif aux présentes CGV fera d'abord l'objet d'une tentative de résolution amiable "
        "en contactant juridique@tyrolium.fr. À défaut d'accord amiable dans un délai de 30 jours, les "
        "parties pourront saisir les tribunaux compétents de France.\n"
        "Règlement en ligne des litiges (ODR) : Conformément à l'article 14 du Règlement (UE) n° 524/2013, "
        "la Commission européenne a mis en place une plateforme RLL accessible à ec.europa.eu/consumers/odr.\n"
        "Médiateur certifié (ADR) : Pour les litiges B2C relatifs aux services numériques, l'autorité de "
        "surveillance compétente au titre du DSA est l'ARCOM (arcom.fr). Pour les litiges commerciaux, les "
        "parties s'engagent à tenter une médiation avant toute action judiciaire."
    )
    pdf.ln(4)
    pdf.italic("© 2017-2026 Tyrolium. Tous droits réservés.")

    # ── Politique de Confidentialité ──────────────────────────────────
    pdf.add_page()
    pdf.label("Confidentialité")
    pdf.h1("Politique de confidentialité")
    pdf.italic("Dernière mise à jour : 16 juin 2026")
    pdf.ln(2)
    pdf.body(
        "Sommaire : 1. Responsable du traitement · 2. Données collectées et finalités · "
        "3. Base légale et durées de conservation · 4. Sous-traitants et destinataires · "
        "5. Transferts internationaux · 6. Sécurité des données · 7. Cookies · 8. Vos droits · "
        "9. Contact et CNIL"
    )
    pdf.divider()

    pdf.h2("1. Responsable du traitement")
    pdf.body(
        "Le responsable du traitement au sens du RGPD (Règlement (UE) 2016/679) et de la loi "
        "Informatique et Libertés est :\n"
        "Tyrolium · SIRET : 91027536100012\n"
        "252 Avenue Jean Jaurès — 69150 Décines-Charpieu, France\n"
        "Contact : juridique@tyrolium.fr\n\n"
        "Tyrolium n'a pas désigné de Délégué à la Protection des Données (DPO), cette désignation "
        "n'étant pas obligatoire pour une structure de sa taille. Toute demande relative à la "
        "protection des données est traitée directement par juridique@tyrolium.fr."
    )
    pdf.divider()

    pdf.h2("2. Données collectées et finalités")
    donnees = [
        ("Comptes utilisateurs (Useritium)",
         "Lors de la création d'un compte sur Useritium, nous collectons : adresse e-mail, nom "
         "d'utilisateur, mot de passe chiffré, date de création du compte et date de dernière connexion. "
         "Ces données servent à gérer l'authentification et à fournir l'accès aux services Tyrolium."),
        ("Achats et abonnements",
         "Pour les achats réalisés sur TyroServ, SolidServ et NexiumiaCRM, nous collectons : adresse "
         "e-mail, informations de facturation (nom, adresse), historique des achats et factures. "
         "Les données de carte bancaire sont traitées exclusivement par Stripe — Tyrolium ne stocke "
         "aucune information bancaire."),
        ("Données hébergées — SolidServ",
         "SolidServ stocke les données et fichiers déposés par les clients sur leurs serveurs "
         "(serveurs de jeu, VPS, serveurs dédiés). Ces données restent la propriété exclusive du client. "
         "Tyrolium agit en tant que sous-traitant pour le compte du client."),
        ("Données CRM — NexiumiaCRM",
         "Les données saisies par le client dans NexiumiaCRM (contacts, interactions, notes, etc.) "
         "sont traitées par Tyrolium uniquement dans le cadre de la fourniture du service. "
         "Ces données appartiennent au client. Tyrolium agit en tant que sous-traitant."),
        ("Formulaires de contact",
         "Lorsque vous utilisez notre formulaire de contact, nous collectons : votre nom, votre adresse "
         "e-mail et le contenu de votre message. Ces données servent uniquement à traiter votre demande "
         "et ne sont utilisées à aucune fin de prospection commerciale."),
        ("Navigation sur le site",
         "Tyrolium n'utilise aucun outil d'analyse d'audience (Google Analytics, Matomo, etc.). "
         "Aucune donnée de navigation n'est collectée ni partagée avec des tiers à des fins "
         "publicitaires ou statistiques."),
    ]
    for t, d in donnees:
        pdf._f("B", 10); pdf.set_text_color(*BLUE); pdf.cell(0, 6, t, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.body(d)
    pdf.divider()

    pdf.h2("3. Base légale et durées de conservation")
    pdf.body(
        "L'ensemble des données personnelles traitées par Tyrolium repose sur l'exécution du contrat "
        "(article 6.1.b RGPD). Les données issues des formulaires de contact sont traitées sur la base "
        "de l'intérêt légitime (article 6.1.f RGPD)."
    )
    pdf.bullet_list([
        "Comptes utilisateurs : durée du compte, puis 3 ans après sa suppression",
        "Factures et historique d'achats : 10 ans à compter de la date d'émission (Code de commerce, art. L123-22)",
        "Données hébergées SolidServ / NexiumiaCRM : durée de l'abonnement, puis 30 jours avant suppression",
        "Données formulaires de contact : 3 ans après le dernier contact",
        "Journaux serveur (logs) : 12 mois (obligation légale — LCEN art. 6)",
    ])
    pdf.divider()

    pdf.h2("4. Sous-traitants et destinataires")
    pdf.body("Tyrolium fait appel à un seul sous-traitant externe pour le traitement des données :")
    # Table
    col_w = (pdf.w - pdf.l_margin - pdf.r_margin) / 3
    headers = ["Sous-traitant", "Finalité", "Localisation"]
    pdf._f("B", 9); pdf.set_text_color(*WHITE)
    y0 = pdf.get_y()
    pdf.set_fill_color(*BLUE)
    for h in headers:
        pdf.set_x(pdf.l_margin + headers.index(h) * col_w)
        pdf.cell(col_w, 7, h, fill=True, border=0)
    pdf.ln(7)
    pdf._f("R", 9); pdf.set_text_color(*TEXT)
    vals = ["Stripe Payments Europe, Ltd.", "Traitement sécurisé des paiements", "Irlande (UE)"]
    for v in vals:
        pdf.set_x(pdf.l_margin + vals.index(v) * col_w)
        pdf.cell(col_w, 6, v, border="B")
    pdf.ln(8)
    pdf.body(
        "Stripe est certifié PCI-DSS et conforme au RGPD. Tyrolium n'a jamais accès directement à vos "
        "coordonnées bancaires.\n"
        "L'hébergement de l'infrastructure est assuré par SolidServ, filiale propre de Tyrolium. "
        "Tous les serveurs sont localisés en France. Aucun autre tiers n'a accès aux données personnelles."
    )
    pdf.divider()

    pdf.h2("5. Transferts internationaux")
    pdf.body(
        "Tyrolium ne transfère aucune donnée personnelle en dehors de l'Union européenne. "
        "Toutes les données sont hébergées sur des serveurs situés en France (SolidServ). "
        "Notre unique sous-traitant externe, Stripe Payments Europe Ltd., est établi en Irlande "
        "et donc soumis au RGPD, sans transfert hors UE."
    )
    pdf.divider()

    pdf.h2("6. Sécurité des données")
    pdf.body(
        "Tyrolium met en œuvre des mesures techniques et organisationnelles appropriées pour protéger "
        "les données personnelles, conformément à l'article 32 du RGPD."
    )
    pdf.bullet_list([
        "Chiffrement des mots de passe (hachage avec bcrypt ou équivalent)",
        "Chiffrement HTTPS pour toutes les données en transit",
        "Accès aux données restreint aux seules personnes habilitées",
        "Sauvegardes automatiques quotidiennes conservées 7 jours (SolidServ)",
        "Serveurs hébergés dans des datacentres sécurisés en France",
    ])
    pdf.body(
        "En cas de violation de données personnelles susceptible d'entraîner un risque, Tyrolium "
        "s'engage à notifier la CNIL dans les 72 heures (article 33 du RGPD) et à informer les "
        "personnes concernées sans délai excessif si la violation présente un risque élevé."
    )
    pdf.divider()

    pdf.h2("7. Cookies")
    pdf.body(
        "Tyrolium utilise uniquement des cookies strictement nécessaires, c'est-à-dire indispensables "
        "au fonctionnement des services. Aucun cookie publicitaire, de traçage ou d'analyse tiers n'est "
        "déposé sur votre appareil (article 82 de la loi Informatique et Libertés)."
    )
    headers2 = ["Cookie", "Finalité", "Durée"]
    pdf._f("B", 9); pdf.set_text_color(*WHITE)
    pdf.set_fill_color(*BLUE)
    for h in headers2:
        pdf.set_x(pdf.l_margin + headers2.index(h) * col_w)
        pdf.cell(col_w, 7, h, fill=True, border=0)
    pdf.ln(7)
    cookies_rows = [
        ("Session token", "Authentification utilisateur (Useritium)", "Session / 30 jours"),
        ("Préférence de langue", "Mémorise le choix de langue (FR/EN)", "1 an"),
        ("Préférence de thème", "Mémorise le mode sombre/clair", "1 an"),
    ]
    for row in cookies_rows:
        pdf._f("R", 9); pdf.set_text_color(*TEXT)
        for j, v in enumerate(row):
            pdf.set_x(pdf.l_margin + j * col_w)
            pdf.cell(col_w, 6, v, border="B")
        pdf.ln(6)
    pdf.ln(3)
    pdf.divider()

    pdf.h2("8. Vos droits")
    pdf.body(
        "Conformément au RGPD (articles 15 à 22) et à la loi Informatique et Libertés, "
        "vous disposez des droits suivants sur vos données personnelles :"
    )
    pdf.bullet_list([
        "Droit d'accès (art. 15) : obtenir une copie des données personnelles que nous détenons",
        "Droit de rectification (art. 16) : corriger des données inexactes ou incomplètes",
        "Droit à l'effacement (art. 17) : demander la suppression de vos données",
        "Droit à la limitation (art. 18) : limiter le traitement de vos données dans certaines situations",
        "Droit à la portabilité (art. 20) : recevoir vos données dans un format structuré et lisible",
        "Droit d'opposition (art. 21) : vous opposer au traitement basé sur l'intérêt légitime",
        "Droit de réclamation (art. 77) : déposer une réclamation auprès de la CNIL",
    ])
    pdf.body(
        "Pour exercer l'un de ces droits, adressez votre demande à juridique@tyrolium.fr. "
        "Nous nous engageons à vous répondre dans un délai d'un mois (article 12 RGPD)."
    )
    pdf.divider()

    pdf.h2("9. Contact et CNIL")
    pdf.body(
        "Pour toute question relative à la présente politique ou pour exercer vos droits :\n"
        "juridique@tyrolium.fr\n\n"
        "Si vous estimez que vos droits n'ont pas été respectés, vous avez le droit de déposer une "
        "réclamation auprès de la CNIL :\n"
        "CNIL — 3 Place de Fontenoy — TSA 80715 — 75334 Paris Cedex 07\n"
        "Site web : cnil.fr · Plainte en ligne : cnil.fr/fr/plaintes"
    )
    pdf.ln(4)
    pdf.italic("© 2017-2026 Tyrolium. Tous droits réservés.")

    path = os.path.join(DIST, "tyrolium-legal.pdf")
    pdf.output(path)
    print(f"✓  {path}")


# ════════════════════════════════════════════════════════════════════════
# 2 — ÉQUIPE
# ════════════════════════════════════════════════════════════════════════

poles = [
    ("Management",       ["Pierre-Louis Devaud — Chef de Projet, Conseiller Technique",
                          "Mathis Dubief — Co-fondateur, Journaliste Jeux Vidéo",
                          "Maewan Marthelot — Co-fondateur, Graphiste",
                          "Mathys Lacoque — Réalisateur de jeux-vidéo, Développeur"]),
    ("Technique",        ["Kevin Muziak — Développeur Web & Minecraft",
                          "Clément Charrassier — Développeur Web",
                          "Rayan Quessada — Développeur Web",
                          "Angelo Fernandez — Développeur Web",
                          "Elias Poder — Développeur Web",
                          "Maktoum Abdelhak — Développeur Web",
                          "Oscar Boguszewski — Développeur Web",
                          "Adèle Jausons — Développeur Web",
                          "Bastien Thiebaut — Développeur Web",
                          "Erynn Vandre — Développeur Web",
                          "Arnaud Monel — Développeur",
                          "Noa Guilhot — Développeur",
                          "Esteban Mignotte — Administrateur réseau"]),
    ("Graphisme",        ["Luigi Guyot — UX/UI Designer, Support Technique",
                          "Daniel Taniou — Graphiste, Linguiste",
                          "Ren LIM — Graphiste, Monteur-Vidéo"]),
    ("Modération / SAV", ["Dylan Argentino — Support Technique, Modérateur",
                          "Flavien Dechoz — Support Technique, Modérateur"]),
]


def build_equipe():
    pdf = Base("P", "mm", "A4")
    pdf.new_doc("Tyrolium — Équipe")

    pdf.hero(
        "NOTRE ÉQUIPE",
        "Qui sommes-nous",
        "Derrière chaque produit, chaque fonctionnalité, chaque ligne de code —\n"
        "une équipe passionnée qui construit Tyrolium jour après jour.",
    )

    # ── Fondateur ──
    pdf.label("Fondateur")
    pdf.h2("À la tête du groupe")
    pdf.ln(2)

    y0 = pdf.get_y()
    pw = pdf.w - pdf.l_margin - pdf.r_margin
    pdf.set_fill_color(*BLUE)
    pdf.rect(pdf.l_margin, y0, pw, 38, "F")
    pdf.set_fill_color(*ACCENT)
    pdf.rect(pdf.l_margin, y0, 4, 38, "F")

    pdf.set_xy(pdf.l_margin + 10, y0 + 5)
    pdf._f("B", 16); pdf.set_text_color(*WHITE)
    pdf.cell(0, 8, "Maxime Tournier")
    pdf.set_xy(pdf.l_margin + 10, y0 + 14)
    pdf._f("R", 10); pdf.set_text_color(180, 200, 235)
    pdf.cell(0, 6, "PDG & Fondateur")
    pdf.set_xy(pdf.l_margin + 10, y0 + 22)
    pdf._f("R", 8.5); pdf.set_text_color(160, 180, 215)
    pdf.cell(0, 5.5,
             "Fondateur de Tyrolium en 2017 — Visionnaire, entrepreneur et développeur — "
             "8 filiales — 22 membres")
    pdf.set_y(y0 + 43)
    pdf.ln(4)

    # ── Pôles ──
    pdf.label("Équipe")
    pdf.h2("L'équipe")
    pdf.body("Des profils variés, une passion commune. Ensemble on construit, on livre, on grandit.")

    for pole_name, members in poles:
        pdf.guard(18)
        pdf.section_bar(pole_name)
        col_w = (pdf.w - pdf.l_margin - pdf.r_margin) / 2
        rows = [members[i:i+2] for i in range(0, len(members), 2)]
        for row in rows:
            pdf.guard(12)
            ry = pdf.get_y()
            for ci, m in enumerate(row):
                name, role = m.split(" — ", 1)
                x = pdf.l_margin + ci * col_w
                pdf.set_xy(x + 2, ry)
                pdf._f("B", 9.5); pdf.set_text_color(*BLUE)
                pdf.cell(col_w - 4, 5.5, name)
                pdf.set_xy(x + 2, ry + 5.5)
                pdf._f("R", 8.5); pdf.set_text_color(*MUTED)
                pdf.cell(col_w - 4, 5)
            pdf.set_y(ry + 11)
        pdf.ln(4)

    # CTA
    pdf.guard(22)
    y0 = pdf.get_y(); pw = pdf.w - pdf.l_margin - pdf.r_margin
    pdf.set_fill_color(*LIGHT)
    pdf.rect(pdf.l_margin, y0, pw, 22, "F")
    pdf.set_xy(pdf.l_margin + 5, y0 + 5)
    pdf._f("B", 12); pdf.set_text_color(*BLUE)
    pdf.cell(0, 7, "Construis le futur avec nous.")
    pdf.set_xy(pdf.l_margin + 5, y0 + 13)
    pdf._f("R", 9); pdf.set_text_color(*MUTED)
    pdf.cell(0, 5, "Nous cherchons toujours des personnes passionnées. Voir les offres : jobs.tyrolium.fr")

    path = os.path.join(DIST, "tyrolium-equipe.pdf")
    pdf.output(path)
    print(f"✓  {path}")


# ════════════════════════════════════════════════════════════════════════
# 3 — PARTENAIRES
# ════════════════════════════════════════════════════════════════════════

categories = [
    ("Partenaires Académiques", [
        ("Human Booster", "École & accélérateur tech"),
        ("Simplon", "Formation numérique inclusive"),
        ("Ynov Connect", "Réseau des campus Ynov"),
        ("IPSSI", "École informatique & cybersécurité"),
    ]),
    ("Partenaires Institutionnels", [
        ("Région Auvergne-Rhône-Alpes", "Région AuRA"),
        ("Région Grand-Est", "Région Grand-Est"),
        ("French Tech St-Étienne / Lyon", "Écosystème startup"),
    ]),
    ("Partenaires Technologiques", [
        ("Proxmox", "Virtualisation & conteneurs"),
        ("Stripe", "Paiement en ligne"),
        ("OVH", "Cloud & hébergement"),
        ("Tebex", "Monétisation gaming"),
    ]),
    ("Partenaires Professionnels", [
        ("Bâtir Positif", "Construction & RSE"),
        ("Graphic Nook", "Design & identité"),
        ("Evogue", "Communication"),
        ("Ascentia", "Projets Minecraft"),
    ]),
    ("Partenaires Associatifs", [
        ("Génération IUM", "Association d'entrepreneurs"),
        ("MO5", "Patrimoine du jeu vidéo"),
    ]),
]


def build_partenaires():
    pdf = Base("P", "mm", "A4")
    pdf.new_doc("Tyrolium — Partenaires")

    pdf.hero(
        "NOTRE RÉSEAU",
        "Partenaires",
        "Les organismes, institutions et entreprises qui font confiance à Tyrolium\n"
        "et soutiennent son développement.",
    )

    for cat_name, partners in categories:
        pdf.guard(24)
        pdf.section_bar(cat_name)
        pdf.ln(2)

        col_w = (pdf.w - pdf.l_margin - pdf.r_margin) / 2
        rows = [partners[i:i+2] for i in range(0, len(partners), 2)]
        for row in rows:
            pdf.guard(18)
            ry = pdf.get_y()
            for ci, (name, desc) in enumerate(row):
                x = pdf.l_margin + ci * col_w
                pdf.set_fill_color(*WHITE)
                pdf.set_draw_color(*BORDER)
                pdf.set_line_width(0.2)
                pdf.rect(x + 1, ry, col_w - 2, 14, "FD")
                pdf.set_fill_color(*ACCENT)
                pdf.rect(x + 1, ry, 3, 14, "F")
                pdf.set_xy(x + 7, ry + 2)
                pdf._f("B", 10); pdf.set_text_color(*BLUE)
                pdf.cell(col_w - 10, 5.5, name)
                pdf.set_xy(x + 7, ry + 8)
                pdf._f("R", 8.5); pdf.set_text_color(*MUTED)
                pdf.cell(col_w - 10, 5, desc)
            pdf.set_y(ry + 16)
        pdf.ln(4)

    pdf.guard(16)
    y0 = pdf.get_y(); pw = pdf.w - pdf.l_margin - pdf.r_margin
    pdf.set_fill_color(*LIGHT)
    pdf.rect(pdf.l_margin, y0, pw, 14, "F")
    pdf.set_xy(pdf.l_margin + 5, y0 + 4)
    pdf._f("I", 9.5); pdf.set_text_color(*MUTED)
    pdf.cell(0, 6, "Vous souhaitez devenir partenaire de Tyrolium ? Contactez-nous : contact@tyrolium.fr")

    path = os.path.join(DIST, "tyrolium-partenaires.pdf")
    pdf.output(path)
    print(f"✓  {path}")


# ════════════════════════════════════════════════════════════════════════
# 4 — HOME / FILIALES
# ════════════════════════════════════════════════════════════════════════

expertises = [
    ("Développement Informatique",
     "Conception et développement d'applications modernes, performantes et accessibles.",
     ["Sites vitrine & e-commerce", "Applications web métier", "API & intégrations"]),
    ("Infrastructure & Cloud",
     "Architecture, déploiement et supervision de vos infrastructures cloud et serveurs.",
     ["Hébergement haute disponibilité", "DevOps & automatisation", "Monitoring & sécurité"]),
    ("Incubateur de projet",
     "Accompagnement stratégique dans votre création ou transformation de votre projet.",
     ["Mentorat & Accompagnement", "Réseau & Partenaires", "Pilotage de projet"]),
]

filiales = [
    ("TyroServ",     "Serveur Minecraft",          "tyroserv.fr"),
    ("SolidServ",    "Hébergeur de serveurs",       "solidserv.fr"),
    ("Influnias",    "Agence d'influenceurs",        "influnias.fr"),
    ("Vturias",      "Agence de VTubers",            "vturias.fr"),
    ("TyroCiel",     "Studio de jeu-vidéo",          "tyrociel.fr"),
    ("Gamenium",     "Site d'actu jeu-vidéo",        "gamenium.fr"),
    ("NexiumiaCRM",  "CRM",                         "nexiumiacrm.fr"),
    ("Useritium",    "Compte universel français",    "useritium.fr"),
]

valeurs = [
    ("Expertise technique",
     "Des développeurs passionnés qui maîtrisent les technologies modernes du frontend au backend."),
    ("Entreprise française",
     "Basés en France, nos données et infrastructures restent sur le territoire français. "
     "Souveraineté numérique garantie."),
    ("Passion & Innovation",
     "Fondée par des passionnés en 2017, Tyrolium pousse toujours vers l'innovation et l'amélioration continue."),
    ("Partenariat durable",
     "Nous ne sommes pas de simples prestataires. Nous nous impliquons sur le long terme pour "
     "faire évoluer votre produit avec vous."),
]

stats = [
    ("2017",   "Fondée en",               "Le point de départ de l'aventure Tyrolium"),
    ("+1 500", "Clients accompagnés",      "Sites web, serveurs & formations"),
    ("8",      "Filiales actives",         "Un groupe en pleine expansion"),
    ("+8M",    "Utilisateurs touchés",     "À travers l'ensemble de nos projets"),
]

timeline = [
    ("2017", "Naissance de Tyrolium",
     "Lancement du serveur Minecraft moddé, le point de départ de l'aventure Tyrolium."),
    ("2019", "Création de la Holding",
     "Structuration de Tyrolium en holding technologique couvrant développement, cloud et incubateur de projet."),
    ("2020", "Prestations web & jeu-vidéo",
     "Lancement de prestations professionnelles en développement web et création de jeux-vidéo."),
    ("2022", "Expansion infrastructure",
     "Lancement de l'hébergement de serveurs et services d'infrastructure cloud."),
    ("2026", "Notre entrée dans l'univers du gaming",
     "Création et développement de notre propre studio de jeu-vidéo pour produire des expériences gaming innovantes."),
    ("Aujourd'hui", "En pleine croissance",
     "Tyrolium continue d'innover, d'étendre son écosystème et d'accompagner ses clients avec ambition."),
]


def build_home():
    pdf = Base("P", "mm", "A4")
    pdf.new_doc("Tyrolium — Home & Filiales")

    # Hero
    pdf.set_fill_color(*BLUE)
    pdf.rect(0, 0, pdf.w, 85, "F")
    pdf.set_y(16)
    pdf._f("B", 9); pdf.set_text_color(*ACCENT)
    pdf.cell(0, 6, "TYROLIUM", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf._f("B", 26); pdf.set_text_color(*WHITE)
    pdf.cell(0, 12, "Holding Technologique Française", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf._f("R", 9.5); pdf.set_text_color(195, 210, 235)
    pdf.multi_cell(
        0, 5.5,
        "De la conception au déploiement, Tyrolium vous accompagne à chaque étape\n"
        "de votre projet numérique avec expertise et passion.",
        align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT,
    )
    pdf.set_y(90)

    # ── Nos Expertises ──
    pdf.label("Ce que nous faisons")
    pdf.h2("Nos Expertises")
    col_w = (pdf.w - pdf.l_margin - pdf.r_margin) / 3
    pdf.guard(52)
    y0 = pdf.get_y()
    for i, (title, desc, items) in enumerate(expertises):
        x = pdf.l_margin + i * col_w
        pdf.set_fill_color(*WHITE)
        pdf.set_draw_color(*BORDER); pdf.set_line_width(0.2)
        pdf.rect(x + 1, y0, col_w - 2, 52, "FD")
        pdf.set_fill_color(*ACCENT)
        pdf.rect(x + 1, y0, col_w - 2, 3, "F")
        pdf.set_xy(x + 4, y0 + 6)
        pdf._f("B", 9.5); pdf.set_text_color(*BLUE)
        pdf.multi_cell(col_w - 8, 5.5, title)
        pdf.set_xy(x + 4, pdf.get_y() + 2)
        pdf._f("R", 8.5); pdf.set_text_color(*TEXT)
        pdf.multi_cell(col_w - 8, 4.8, desc)
        by = pdf.get_y() + 2
        for item in items:
            pdf.set_xy(x + 6, by)
            pdf._f("R", 8); pdf.set_text_color(*MUTED)
            pdf.cell(col_w - 10, 4.5, f"• {item}")
            by += 4.8
    pdf.set_y(y0 + 57)

    # ── Nos Filiales ──
    pdf.ln(4)
    pdf.label("Notre groupe")
    pdf.h2("Nos Filiales")
    pdf.body(
        "Depuis 2017, Tyrolium coordonne un ensemble de filiales spécialisées, chacune experte dans "
        "son domaine, de l'infrastructure à l'innovation numérique."
    )
    col_w2 = (pdf.w - pdf.l_margin - pdf.r_margin) / 2
    rows = [filiales[i:i+2] for i in range(0, len(filiales), 2)]
    for row in rows:
        pdf.guard(18)
        ry = pdf.get_y()
        for ci, (name, desc, link) in enumerate(row):
            x = pdf.l_margin + ci * col_w2
            pdf.set_fill_color(*BLUE)
            pdf.rect(x + 1, ry, col_w2 - 2, 15, "F")
            pdf.set_fill_color(*ACCENT)
            pdf.rect(x + 1, ry, 3, 15, "F")
            pdf.set_xy(x + 7, ry + 2)
            pdf._f("B", 10); pdf.set_text_color(*WHITE)
            pdf.cell(col_w2 - 10, 5.5, name)
            pdf.set_xy(x + 7, ry + 8)
            pdf._f("R", 8); pdf.set_text_color(180, 200, 230)
            pdf.cell(col_w2 - 10, 4.5, f"{desc} — {link}")
        pdf.set_y(ry + 17)
    pdf.ln(4)

    # ── Pourquoi Tyrolium ──
    pdf.label("Notre différence")
    pdf.h2("Pourquoi choisir Tyrolium ?")
    col_w3 = (pdf.w - pdf.l_margin - pdf.r_margin) / 2
    rows2 = [valeurs[i:i+2] for i in range(0, len(valeurs), 2)]
    for row in rows2:
        pdf.guard(22)
        ry = pdf.get_y()
        for ci, (title, desc) in enumerate(row):
            x = pdf.l_margin + ci * col_w3
            pdf.set_xy(x + 2, ry)
            pdf._f("B", 10); pdf.set_text_color(*BLUE)
            pdf.cell(col_w3 - 4, 6, title)
            pdf.set_xy(x + 2, ry + 6)
            pdf._f("R", 8.5); pdf.set_text_color(*TEXT)
            pdf.multi_cell(col_w3 - 4, 4.5, desc)
        pdf.set_y(ry + 22)
    pdf.ln(4)

    # ── Chiffres clés ──
    pdf.guard(38)
    pdf.section_bar("Chiffres clés")
    pdf.ln(3)
    col_w4 = (pdf.w - pdf.l_margin - pdf.r_margin) / 4
    y0 = pdf.get_y()
    for i, (num, lbl, sdesc) in enumerate(stats):
        x = pdf.l_margin + i * col_w4
        pdf.set_fill_color(*BLUE)
        pdf.rect(x + 1, y0, col_w4 - 2, 30, "F")
        pdf.set_xy(x + 1, y0 + 4)
        pdf._f("B", 16); pdf.set_text_color(*WHITE)
        pdf.cell(col_w4 - 2, 8, num, align="C")
        pdf.set_xy(x + 1, y0 + 13)
        pdf._f("B", 8); pdf.set_text_color(190, 210, 240)
        pdf.multi_cell(col_w4 - 2, 4, lbl, align="C")
        pdf.set_xy(x + 1, y0 + 21)
        pdf._f("R", 7); pdf.set_text_color(160, 180, 215)
        pdf.multi_cell(col_w4 - 2, 3.5, sdesc, align="C")
    pdf.set_y(y0 + 35)
    pdf.ln(4)

    # ── Timeline ──
    pdf.label("Notre histoire")
    pdf.h2("Notre Parcours")
    for year, title_tl, desc_tl in timeline:
        pdf.guard(18)
        ry = pdf.get_y()
        is_now = year == "Aujourd'hui"
        # Dot
        pdf.set_fill_color(*(ACCENT if is_now else MUTED))
        pdf.ellipse(pdf.l_margin + 1, ry + 2, 4, 4, "F")
        # Line
        if timeline.index((year, title_tl, desc_tl)) < len(timeline) - 1:
            pdf.set_draw_color(*BORDER); pdf.set_line_width(0.5)
            pdf.line(pdf.l_margin + 3, ry + 6, pdf.l_margin + 3, ry + 20)
        # Year badge
        pdf.set_xy(pdf.l_margin + 8, ry)
        pdf._f("B", 8); pdf.set_text_color(*ACCENT)
        pdf.cell(18, 5.5, year)
        # Title
        pdf.set_xy(pdf.l_margin + 8, ry + 6)
        pdf._f("B", 10); pdf.set_text_color(*BLUE)
        pdf.cell(0, 5.5, title_tl)
        # Desc
        pdf.set_xy(pdf.l_margin + 8, ry + 12)
        pdf._f("R", 8.5); pdf.set_text_color(*TEXT)
        pdf.multi_cell(pdf.w - pdf.l_margin - pdf.r_margin - 10, 4.8, desc_tl,
                       new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(3)

    # CTA final
    pdf.guard(22)
    y0 = pdf.get_y(); pw = pdf.w - pdf.l_margin - pdf.r_margin
    pdf.set_fill_color(*BLUE)
    pdf.rect(pdf.l_margin, y0, pw, 22, "F")
    pdf.set_xy(pdf.l_margin + 6, y0 + 5)
    pdf._f("B", 13); pdf.set_text_color(*WHITE)
    pdf.cell(0, 7, "Prêt à démarrer votre projet ?")
    pdf.set_xy(pdf.l_margin + 6, y0 + 13)
    pdf._f("R", 9); pdf.set_text_color(185, 205, 240)
    pdf.cell(0, 5, "Nos équipes sont disponibles pour étudier votre projet. contact@tyrolium.fr")

    path = os.path.join(DIST, "tyrolium-home.pdf")
    pdf.output(path)
    print(f"✓  {path}")


# ════════════════════════════════════════════════════════════════════════
# Main
# ════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    os.makedirs(DIST, exist_ok=True)
    print("Génération des PDFs...")
    build_legal()
    build_equipe()
    build_partenaires()
    build_home()
    print("Terminé !")
