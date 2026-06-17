#!/usr/bin/env python3
from fpdf import FPDF
from fpdf.enums import XPos, YPos
import os

SFNS        = "/System/Library/Fonts/SFNS.ttf"
SFNS_ITALIC = "/System/Library/Fonts/SFNSItalic.ttf"
DIST        = os.path.join(os.path.dirname(__file__), "../dist")

BLUE   = (13,  27,  57)
LIGHT  = (246, 247, 251)
TEXT   = (30,  30,  40)
MUTED  = (100, 110, 130)
WHITE  = (255, 255, 255)
BORDER = (220, 225, 235)


# ── Base class ────────────────────────────────────────────────────────────────

class Base(FPDF):
    _footer_label = ""
    _accent = (59, 130, 246)

    def setup_fonts(self):
        self.add_font("sf",  fname=SFNS,        uni=True)
        self.add_font("sfi", fname=SFNS_ITALIC, uni=True)
        self.add_font("sfb", fname=SFNS,        uni=True)

    def _f(self, style="R", size=10):
        m = {"R": "sf", "I": "sfi", "B": "sfb"}
        self.set_font(m.get(style, "sf"), size=size)

    def header(self):
        pass

    def footer(self):
        self.set_y(-14)
        self._f("R", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 10, f"{self._footer_label} — Document de présentation — Page {self.page_no()}", align="C")

    def new_doc(self, label="", accent=(59, 130, 246)):
        self.set_auto_page_break(True, margin=18)
        self.set_margins(18, 10, 18)
        self.setup_fonts()
        self._footer_label = label
        self._accent = accent
        self.add_page()

    # ── Typography helpers ────────────────────────────────────────────────────

    def label(self, text):
        self._f("B", 8)
        self.set_text_color(*self._accent)
        self.cell(0, 6, text.upper(), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    def h2(self, text, size=16):
        self._f("B", size)
        self.set_text_color(*BLUE)
        self.multi_cell(0, 8, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)

    def h3(self, text, size=12):
        self._f("B", size)
        self.set_text_color(*BLUE)
        self.multi_cell(0, 7, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    def body(self, text, size=10):
        self._f("R", size)
        self.set_text_color(*TEXT)
        self.multi_cell(0, 5.5, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

    def italic(self, text, size=10):
        self._f("I", size)
        self.set_text_color(*MUTED)
        self.multi_cell(0, 5.5, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)

    def bullet_list(self, items, size=9.5):
        self._f("R", size)
        self.set_text_color(*TEXT)
        for item in items:
            self.cell(6, 5.5, "•")
            self.multi_cell(0, 5.5, item, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

    def divider(self):
        self.ln(3)
        self.set_draw_color(*BORDER)
        self.set_line_width(0.3)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(5)

    def guard(self, h):
        if self.get_y() + h > self.h - self.b_margin - 18:
            self.add_page()

    # ── Layout blocks ─────────────────────────────────────────────────────────

    def hero(self, brand, tagline, subtitle=None, stats=None):
        h = 72 if not stats else 90
        self.set_fill_color(*BLUE)
        self.rect(0, 0, self.w, h, "F")

        self.set_y(14)
        self._f("B", 9)
        self.set_text_color(*self._accent)
        self.cell(0, 6, brand.upper(), align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        self._f("B", 26)
        self.set_text_color(*WHITE)
        self.cell(0, 12, tagline, align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        if subtitle:
            self._f("R", 9.5)
            self.set_text_color(195, 210, 235)
            self.multi_cell(0, 5.5, subtitle, align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        if stats:
            self.ln(4)
            col_w = (self.w - self.l_margin - self.r_margin) / len(stats)
            x0 = self.l_margin
            y0 = self.get_y()
            for i, (val, lbl) in enumerate(stats):
                x = x0 + i * col_w
                self.set_xy(x, y0)
                self._f("B", 16)
                self.set_text_color(*WHITE)
                self.cell(col_w, 8, val, align="C")
                self.set_xy(x, y0 + 9)
                self._f("R", 7.5)
                self.set_text_color(180, 200, 230)
                self.multi_cell(col_w, 4, lbl, align="C")

        self.set_y(h + 8)

    def section_bar(self, title):
        self.guard(14)
        self.ln(4)
        y = self.get_y()
        self.set_fill_color(*self._accent)
        self.rect(self.l_margin, y, 3.5, 10, "F")
        self.set_xy(self.l_margin + 7, y + 1)
        self._f("B", 13)
        self.set_text_color(*BLUE)
        self.multi_cell(0, 8, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(3)

    def card_grid(self, items, cols=2, card_h=52):
        pw = self.w - self.l_margin - self.r_margin
        gap = 4
        col_w = (pw - gap * (cols - 1)) / cols

        i = 0
        while i < len(items):
            row_items = items[i:i + cols]
            self.guard(card_h + 6)
            ry = self.get_y()
            for j, (title, desc) in enumerate(row_items):
                x = self.l_margin + j * (col_w + gap)
                self.set_fill_color(*LIGHT)
                self.set_draw_color(*BORDER)
                self.set_line_width(0.25)
                self.rect(x, ry, col_w, card_h, "FD")
                self.set_fill_color(*self._accent)
                self.rect(x, ry, col_w, 2.5, "F")
                self.set_xy(x + 5, ry + 7)
                self._f("B", 9.5)
                self.set_text_color(*BLUE)
                self.cell(col_w - 10, 6, title)
                self.set_xy(x + 5, ry + 15)
                self._f("R", 8.5)
                self.set_text_color(*TEXT)
                self.multi_cell(col_w - 10, 4.5, desc)
            self.set_y(ry + card_h + 5)
            i += cols

    def step_row(self, num, title, desc):
        self.guard(24)
        y0 = self.get_y()
        pw = self.w - self.l_margin - self.r_margin
        self.set_fill_color(*self._accent)
        self.set_text_color(*WHITE)
        self._f("B", 12)
        self.rect(self.l_margin, y0, 10, 10, "F")
        self.set_xy(self.l_margin, y0)
        self.cell(10, 10, num, align="C")
        self.set_xy(self.l_margin + 14, y0 + 1)
        self._f("B", 10.5)
        self.set_text_color(*BLUE)
        self.cell(pw - 14, 6, title)
        self.set_xy(self.l_margin + 14, y0 + 9)
        self._f("R", 9)
        self.set_text_color(*TEXT)
        self.multi_cell(pw - 14, 5, desc, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(5)

    def person_row(self, name, role, note=None):
        self.guard(20)
        y0 = self.get_y()
        self.set_fill_color(*self._accent)
        self.rect(self.l_margin, y0, 2.5, 14, "F")
        self.set_xy(self.l_margin + 7, y0 + 1)
        self._f("B", 10)
        self.set_text_color(*BLUE)
        self.cell(0, 6, name)
        self.set_xy(self.l_margin + 7, y0 + 8)
        self._f("I", 9)
        self.set_text_color(*MUTED)
        self.cell(0, 5, role)
        self.set_y(y0 + 16)
        if note:
            self.set_xy(self.l_margin + 7, self.get_y())
            self._f("R", 8.5)
            self.set_text_color(*TEXT)
            self.multi_cell(0, 4.5, note, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            self.ln(1)

    def badge_row(self, items):
        """Horizontal list of status badges (val, lbl) pairs"""
        self.guard(20)
        col_w = (self.w - self.l_margin - self.r_margin) / len(items)
        x0 = self.l_margin
        y0 = self.get_y()
        for i, (val, lbl) in enumerate(items):
            x = x0 + i * col_w
            self.set_fill_color(*BLUE)
            self.rect(x + 1, y0, col_w - 2, 22, "F")
            self.set_xy(x + 1, y0 + 3)
            self._f("B", 14)
            self.set_text_color(*WHITE)
            self.cell(col_w - 2, 8, val, align="C")
            self.set_xy(x + 1, y0 + 12)
            self._f("R", 7.5)
            self.set_text_color(180, 200, 230)
            self.multi_cell(col_w - 2, 4, lbl, align="C")
        self.set_y(y0 + 30)

    def info_note(self, text):
        self.guard(16)
        y0 = self.get_y()
        pw = self.w - self.l_margin - self.r_margin
        self.set_fill_color(*LIGHT)
        self.rect(self.l_margin, y0, pw, 14, "F")
        self.set_xy(self.l_margin + 5, y0 + 4)
        self._f("I", 9)
        self.set_text_color(*MUTED)
        self.multi_cell(pw - 8, 5, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(4)


# ── SolidServ ─────────────────────────────────────────────────────────────────

def build_solidserv():
    doc = Base("P", "mm", "A4")
    doc.new_doc("SolidServ", accent=(191, 0, 0))

    doc.hero(
        "SolidServ",
        "L'hébergement français de référence",
        subtitle="Des serveurs de jeu à l'infrastructure dédiée,\nSolidServ vous offre performance et fiabilité pour chaque projet.",
        stats=[
            ("99.9%", "Uptime garanti"),
            ("+1500", "Clients"),
            ("2022", "Fondé en"),
            ("24/7", "Support expert"),
        ],
    )

    # Products
    doc.section_bar("Nos Solutions")
    doc.label("Produits")
    doc.h2("Choisissez votre hébergement")

    products = [
        ("VPS", "Serveurs virtuels flexibles avec ressources dédiées, contrôle total et déploiement instantané. Jusqu'à 8 vCPU, stockage NVMe SSD, SLA 99.9%."),
        ("Hébergement Web", "Hébergement web managé avec SSL gratuit, emails et bande passante illimitée. Certificat SSL gratuit, sauvegardes automatiques, cPanel inclus."),
        ("Serveur Dédié", "Serveurs bare-metal avec performance totale, sans ressources partagées et isolation complète. Processeurs Ryzen 9, jusqu'à 128 Go RAM, 10 Gbps."),
        ("Minecraft", "Serveurs Minecraft optimisés, déployables instantanément avec panel admin et sauvegardes automatiques. Java & Bedrock, panel Pterodactyl, Anti-DDoS inclus."),
        ("FiveM", "Serveurs FiveM haute performance avec faible latence, optimisés pour les communautés RP. Réseau basse latence, jusqu'à 256 slots, support OneSync."),
    ]
    doc.card_grid(products, cols=2, card_h=55)

    # VPS Plans
    doc.section_bar("Offres VPS — Détail des plans")
    vps_plans = [
        ("VPS-1 — 3,99 €/mois", "1 vCPU AMD Ryzen 7 · 2 Go RAM DDR4 · 50 Go NVMe SSD · 1 Gbps · 1 IPv4 · Anti-DDoS · Accès SSH. Idéal pour démarrer un projet, un blog ou un site vitrine."),
        ("VPS-2 — 8,99 €/mois ★ Populaire", "2 vCPU AMD Ryzen 7 · 4 Go RAM DDR4 · 100 Go NVMe SSD · 1 Gbps · 1 IPv4 · Anti-DDoS · SSH · Snapshots inclus. Référence pour applications web et petits serveurs de jeux."),
        ("VPS-4 — 11,99 €/mois", "4 vCPU AMD Ryzen 7 · 8 Go RAM DDR4 · 150 Go NVMe SSD · 1 Gbps · 1 IPv4 · Anti-DDoS · SSH · Snapshots · Support prioritaire. Pour les applications exigeantes."),
        ("VPS-8 — 25,99 €/mois", "8 vCPU AMD Ryzen 7 · 16 Go RAM DDR4 · 250 Go NVMe SSD · 1 Gbps · 2 IPv4 · Anti-DDoS · SSH · Snapshots · Support prioritaire 24/7 · SLA 99.99%. Puissance maximale."),
    ]
    doc.card_grid(vps_plans, cols=2, card_h=58)

    # Why SolidServ
    doc.section_bar("Pourquoi SolidServ")
    doc.h2("Une infrastructure sur laquelle compter")
    doc.body("Nous ne vendons pas juste des serveurs. Nous construisons une infrastructure fiable avec un support humain 24/7.")

    why = [
        ("SLA 99.9% Uptime", "Infrastructure hébergée dans des datacenters Tier-3 avec alimentation et réseau redondants."),
        ("Support 24/7", "Équipe d'experts à votre disposition jour et nuit, via ticket Discord ou email."),
        ("Anti-DDoS", "Protection anti-DDoS avancée incluse sur toutes nos offres, sans coût supplémentaire."),
        ("Déploiement instantané", "Votre serveur est en ligne en moins de 60 secondes après la validation de votre commande."),
        ("Sauvegardes automatiques", "Sauvegardes quotidiennes conservées 7 jours. Restaurez vos données en un clic depuis le panel."),
        ("Monitoring temps réel", "Suivez la consommation CPU, RAM, disque et réseau en temps réel depuis votre espace client."),
    ]
    doc.card_grid(why, cols=2, card_h=48)

    doc.info_note("SolidServ est l'infrastructure d'hébergement de Tyrolium. Vos données sont hébergées exclusivement sur des serveurs localisés en France.")

    path = os.path.join(DIST, "solidserv.pdf")
    doc.output(path)
    print(f"PDF généré : {path}")


# ── NexiumiaCRM ───────────────────────────────────────────────────────────────

def build_nexiumiacrm():
    doc = Base("P", "mm", "A4")
    doc.new_doc("NexiumiaCRM", accent=(5, 51, 200))

    doc.hero(
        "NexiumiaCRM",
        "Le CRM 100% français",
        subtitle="Le CRM professionnel conçu avec le savoir-faire de Tyrolium,\nhébergé sur des serveurs sécurisés en France.",
    )

    # Features
    doc.section_bar("Fonctionnalités")
    doc.h2("Tout ce dont vous avez besoin")

    features = [
        ("Gestion des contacts", "Centralisez tous vos contacts, clients et prospects dans une interface claire et performante."),
        ("Pipeline commercial", "Visualisez et pilotez vos opportunités à chaque étape de votre cycle de vente."),
        ("Tableaux de bord", "Analysez vos performances avec des rapports et tableaux de bord en temps réel."),
        ("Gestion des tâches", "Planifiez, assignez et suivez les tâches de votre équipe directement dans le CRM."),
        ("Suivi des communications", "Gardez un historique complet de chaque interaction avec vos contacts et clients."),
        ("Accès par clé utilisateur", "Chaque collaborateur dispose de sa propre clé d'accès sécurisée et tracée."),
    ]
    doc.card_grid(features, cols=2, card_h=50)

    # Pricing
    doc.section_bar("Tarification")
    doc.h2("Simple, transparent")
    doc.body("Un abonnement pour démarrer, puis une clé d'accès par utilisateur supplémentaire. Le tout sur devis personnalisé.")

    pricing = [
        ("Abonnement Entreprise — à partir de 500 €/mois",
         "Votre espace NexiumiaCRM déployé et configuré pour votre organisation. Accès complet à tous les modules, hébergé en France (SolidServ), support dédié, onboarding personnalisé, 1 clé administrateur incluse. Prix selon besoins et taille d'équipe."),
        ("Clé d'accès supplémentaire — à partir de 15 €/mois par utilisateur",
         "Chaque nouveau membre dispose de sa propre clé d'accès sécurisée. Accès individuel sécurisé, rôle & permissions configurables, traçabilité complète, ajout ou retrait à tout moment."),
    ]
    doc.card_grid(pricing, cols=1, card_h=58)
    doc.italic("Les prix affichés sont des tarifs de départ. Le tarif final est établi sur devis après analyse de vos besoins. Aucune facturation surprise.")

    # Steps
    doc.section_bar("Comment ça marche")
    doc.h2("Opérationnel en 3 étapes")
    steps = [
        ("01", "Demandez un devis", "Contactez-nous pour définir vos besoins. Nous établissons un devis personnalisé selon la taille de votre équipe."),
        ("02", "Déploiement & accès", "Votre espace NexiumiaCRM est déployé sur nos serveurs sécurisés en France. Chaque utilisateur reçoit sa clé d'accès."),
        ("03", "Utilisez & évoluez", "Ajoutez des utilisateurs à tout moment. Chaque nouvel accès génère un abonnement supplémentaire."),
    ]
    for num, title, desc in steps:
        doc.step_row(num, title, desc)

    # Trust
    doc.section_bar("Pourquoi nous faire confiance")
    trust = [
        ("Hébergement en France", "Vos données restent sur le territoire français. Souveraineté numérique garantie."),
        ("Serveurs sécurisés SolidServ", "Infrastructure haute disponibilité et chiffrée, gérée par SolidServ, le projet d'hébergement de Tyrolium."),
        ("Savoir-faire Tyrolium", "Conçu par les équipes Tyrolium avec des années d'expérience en développement et infrastructure."),
        ("Support dédié", "Une équipe réactive à votre disposition pour vous accompagner dans la prise en main et la durée."),
    ]
    doc.card_grid(trust, cols=2, card_h=48)

    path = os.path.join(DIST, "nexiumiacrm.pdf")
    doc.output(path)
    print(f"PDF généré : {path}")


# ── TyroServ ──────────────────────────────────────────────────────────────────

def build_tyroserv():
    doc = Base("P", "mm", "A4")
    doc.new_doc("TyroServ", accent=(5, 150, 105))

    doc.hero(
        "TyroServ",
        "Le serveur Minecraft PVP Faction",
        subtitle="Chaque saison apporte un nouveau départ, de nouveaux mods et des défis inédits.",
        stats=[
            ("2", "Saisons jouées"),
            ("110K", "Joueurs uniques"),
            ("13k", "Factions créées"),
            ("3", "Saisons au total"),
        ],
    )

    # About
    doc.section_bar("Le serveur")
    doc.h2("Qu'est-ce que TyroServ ?")
    doc.body(
        "TyroServ est un serveur Minecraft PVP Faction moddé conçu pour un gameplay compétitif et communautaire. "
        "Chaque saison apporte un nouveau départ, de nouveaux mods et des défis inédits."
    )
    features = [
        ("PVP Faction", "Formez des alliances, revendiquez des territoires et dominez les factions rivales dans un environnement PVP monde ouvert."),
        ("Mods Personnalisés", "Nous développons notre propre mod \"le TyroMod\" pour une expérience unique et originale conçue exclusivement pour TyroServ."),
        ("Communauté", "Une communauté soudée réunie sur Discord pour organiser des événements, des guerres et des défis saisonniers."),
        ("Resets Saisonniers", "Chaque saison repart de zéro pour tout le monde : nouveau mod, nouvelle carte, nouvelle économie, nouvelles opportunités."),
    ]
    doc.card_grid(features, cols=2, card_h=50)

    # Season 3
    doc.section_bar("Saison 3 en cours de développement")
    doc.h2("Le prochain chapitre")
    doc.body(
        "La troisième saison de TyroServ est actuellement en développement actif. Nous travaillons sur la fonctionnalité "
        "tant attendue de fusion de minerais, un ajout colossal. Pas encore de date de sortie."
    )
    doc.info_note("Statut : Développement actif — pas encore jouable. Rejoignez le Discord pour être notifié en premier.")

    planned = [
        ("TyroMod", "Notre propre mod avec la fusion de minerais tant attendue pour une toute nouvelle expérience de craft."),
        ("Nouvelle Carte", "Une génération de monde entièrement personnalisée pour la guerre de factions."),
        ("Économie Revue", "Une économie en jeu équilibrée, construite à partir des leçons des saisons passées."),
        ("Événements Saisonniers", "Des événements en jeu planifiés pour maintenir la compétition tout au long de la saison."),
    ]
    doc.card_grid(planned, cols=2, card_h=48)

    # History
    doc.section_bar("Historique des saisons")
    seasons = [
        ("Saison 1", "Terminée", "La saison fondatrice de TyroServ. Première version du gameplay PVP Faction avec les mécaniques de base."),
        ("Saison 2", "Terminée", "Améliorations majeures du gameplay, nouvelles mécaniques et communauté renforcée. S1 + S2 combinées : 110K joueurs uniques et 13k factions."),
        ("Saison 3", "En développement", "Le prochain chapitre est en cours d'écriture. Pas encore de date de sortie — suivez notre Discord pour les annonces."),
    ]
    for title, status, desc in seasons:
        doc.guard(20)
        doc.h3(f"{title} — {status}")
        doc.body(desc)

    # Hiring
    doc.section_bar("On recrute")
    doc.h2("Rejoins l'équipe de TyroServ")
    doc.body(
        "Nous recherchons des développeurs talentueux pour contribuer au développement de la Saison 3. "
        "Que vous soyez spécialisés dans les mods, les plugins ou l'infrastructure backend, vos compétences ont leur place dans l'équipe."
    )
    roles = [
        ("Développeur Mods", "Création du TyroMod, le mod propre à TyroServ avec la fonctionnalité de fusion de minerais."),
        ("Développeur Plugins", "Développer le TyroPlugin, le plugin côté serveur pour les mécaniques de jeu."),
        ("Développeur Backend", "Infrastructure, APIs et outils autour du serveur."),
    ]
    doc.card_grid(roles, cols=2, card_h=44)
    doc.italic("Candidatures sur jobs.tyrolium.fr")

    path = os.path.join(DIST, "tyroserv.pdf")
    doc.output(path)
    print(f"PDF généré : {path}")


# ── TyroCiel ──────────────────────────────────────────────────────────────────

def build_tyrociel():
    doc = Base("P", "mm", "A4")
    doc.new_doc("TyroCiel", accent=(124, 58, 237))

    doc.hero(
        "TyroCiel",
        "Le studio de jeux vidéo",
        subtitle="Né en 2020, 100% autofinancé, 2 jeux en développement.",
        stats=[
            ("2020", "Fondé en"),
            ("2", "Jeux en dev"),
            ("100%", "Autofinancé"),
            ("5", "Membres d'équipe"),
        ],
    )

    # About
    doc.section_bar("À propos")
    doc.h2("TyroCiel Studio")
    doc.body(
        "TyroCiel est le studio de développement de jeux vidéo de Tyrolium. Né en 2020, nous développons "
        "des jeux originaux avec une équipe passionnée. Nous croyons à l'indépendance créative totale : "
        "pas d'actionnaire, pas d'investissement externe, 100% autofinancé."
    )

    # Games
    doc.section_bar("Nos Jeux")
    doc.h2("2 projets en développement")

    doc.guard(60)
    doc.h3("Rhodotales — Plateforme HD-2D")
    doc.italic("Statut : En développement")
    doc.body(
        "Rhodotales est un jeu de plateforme HD-2D ancré dans un monde médiéval fantastique. "
        "Sa mécanique signature : naviguer entre 3 plans distincts pour des séquences dynamiques "
        "et une profondeur de jeu inédite dans le genre. Tags : Plateforme · HD-2D · Médiéval."
    )

    doc.divider()

    doc.guard(60)
    doc.h3("TyroServ Game — Aventure / Open World")
    doc.italic("Statut : Concept")
    doc.body(
        "Adapté de l'univers de notre serveur Minecraft TyroServ, ce jeu d'aventure solo en monde ouvert "
        "plonge dans un vaste univers fantastique. Il reprend et réinvente la mécanique de fusion de minerai "
        "du serveur : combinez des minerais pour forger de nouvelles capacités et de nouveaux pouvoirs. "
        "Tags : Aventure · Open World · Solo."
    )

    # Team
    doc.section_bar("L'équipe")
    team = [
        ("Maxime Tournier", "PDG et Fondateur du Studio",   "Jeux favoris : Super Mario · The Legend of Zelda · Minecraft · Cyberpunk 2077"),
        ("Mathys Lacoque",  "Réalisateur et Développeur",   "Jeux favoris : Xenoblade Chronicles X · Final Fantasy · Monster Hunter"),
        ("Arnaud Monel",    "Développeur",                  "Jeux favoris : Monster Hunter · Titanfall"),
        ("Noa Guilhot",     "Développeur",                  "Jeux favoris : Persona · Monster Hunter · Pragmata · Enshrouded"),
        ("Esteban Mignotte","Administrateur réseau",         "Jeux favoris : Plant vs Zombie Garden Warfare · Age of Empire · Fallout"),
    ]
    for name, role, note in team:
        doc.person_row(name, role, note)
    doc.ln(2)

    # Independence
    doc.section_bar("Notre indépendance")
    independence = [
        ("Aucun actionnaire",           "100% auto-fondé — nous ne répondons qu'à notre vision."),
        ("Aucun investissement externe", "Financé par nos propres moyens, sans dilution du capital."),
        ("Aucune levée de fonds",        "Jamais dilués, jamais contraints par des attentes d'investisseurs."),
        ("Liberté créative totale",      "Nos règles, notre vision. La créativité sans compromis."),
    ]
    doc.card_grid(independence, cols=2, card_h=44)

    path = os.path.join(DIST, "tyrociel.pdf")
    doc.output(path)
    print(f"PDF généré : {path}")


# ── Influnias ─────────────────────────────────────────────────────────────────

def build_influnias():
    doc = Base("P", "mm", "A4")
    doc.new_doc("Influnias", accent=(217, 119, 6))

    doc.hero(
        "Influnias",
        "Votre audience, amplifiée.",
        subtitle="Influnias accompagne les créateurs et connecte les marques aux voix qui résonnent vraiment.\nStratégie, partenariats, croissance - on s'occupe de tout.",
        stats=[
            ("30+", "Créateurs"),
            ("60+", "Marques partenaires"),
            ("10M+", "Vues générées"),
        ],
    )

    # About
    doc.section_bar("Notre Mission")
    doc.h2("À propos")
    doc.body(
        "Influnias accompagne les créateurs de contenu sur toutes les plateformes : YouTube, Instagram, TikTok et bien plus. "
        "Nous offrons les outils, les connexions et l'expertise pour transformer votre passion en carrière."
    )
    about_cards = [
        ("Soutien Multicanal", "Influnias accompagne les créateurs sur YouTube, Instagram, TikTok et tous les médias en ligne. Une présence élargie, une visibilité maximale pour vos créations."),
        ("Liberté Créative", "Exprimez-vous sans limite. Influnias valorise l'originalité et vous offre un espace pour explorer vos idées les plus audacieuses, sans compromis sur votre identité."),
        ("Opportunités Immédiates", "Partenariats, visibilité, accompagnement - tout commence maintenant. La passion n'attend pas, et chez Influnias, les portes sont toujours ouvertes aux talents."),
    ]
    doc.card_grid(about_cards, cols=2, card_h=52)

    # How it works
    doc.section_bar("Comment ça marche")
    doc.h2("De la mise en relation au contenu publié")
    steps = [
        ("01", "Rejoignez le réseau", "Créez votre profil créateur, renseignez vos plateformes et votre audience. En quelques minutes, vous faites partie d'Influnias."),
        ("02", "On trouve votre match", "Notre équipe analyse votre univers et vous connecte avec des marques qui correspondent vraiment à votre identité et votre communauté."),
        ("03", "Créez & collaborez", "Le partenariat est lancé. Vous créez du contenu, on gère le reste : contrats, suivi, reporting. Concentrez-vous sur votre passion."),
    ]
    for num, title, desc in steps:
        doc.step_row(num, title, desc)

    # Services
    doc.section_bar("Services")
    doc.h2("Influnias Creator")
    doc.body("En rejoignant Influnias, vous devenez Influnias Creator et accédez à l'ensemble de ces services pour toute la durée de votre collaboration.")

    services = [
        ("Production Créative", "Organisation de shootings photo, de tournages importants, services vidéo complets, et recherche de lieux de tournage."),
        ("Gestion de Projets", "Accompagnement de projets majeurs, planification d'événements pour créateurs, et facilitation des recrutements dans divers domaines."),
        ("Aide à la Visibilité", "Mise en relation avec partenariats, créateurs et influenceurs, ainsi qu'optimisation de la visibilité et promotion de produits."),
        ("Services Techniques", "Informatique personnalisée, création de musique libre de droits, gestion des médias sociaux, et mise en place de la production vidéo."),
        ("Analyse et Rapports", "Études mensuelles des statistiques, récapitulatif des données clés, et suivi du succès du projet."),
        ("Optimisation Communication", "Amélioration de la communication traditionnelle et numérique sur différents canaux."),
        ("Organisation Administrative", "Gestion des rendez-vous et un agent dédié avec FAQ."),
        ("Mise en Avant des Produits", "Promotion de divers produits de créateurs."),
        ("Soutien Psychologique", "Fourniture de soutien émotionnel et psychologique."),
    ]
    doc.card_grid(services, cols=2, card_h=48)

    # Founders
    doc.section_bar("Fondateurs")
    doc.h2("L'équipe fondatrice")
    doc.body("Influnias est né de la vision de deux passionnés du digital, convaincus que chaque créateur mérite un vrai accompagnement.")

    founders = [
        ("Maxime Tournier", "Co-fondateur & CEO",
         '"J\'ai eu l\'envie de créer un projet qui révolutionnerait l\'influence et l\'art sur internet en France. Aujourd\'hui, c\'est chose faite."'),
        ("Maëwan Marthelot", "Co-fondateur",
         '"J\'ai grandi avec l\'idée de créer et partager... Alors, pourquoi pas vous ? Une passion est une source infinie de motivation, alors voici la nôtre."'),
    ]
    for name, role, quote in founders:
        doc.person_row(name, role, quote)
    doc.ln(2)

    path = os.path.join(DIST, "influnias.pdf")
    doc.output(path)
    print(f"PDF généré : {path}")


# ── Useritium ─────────────────────────────────────────────────────────────────

def build_useritium():
    doc = Base("P", "mm", "A4")
    doc.new_doc("Useritium", accent=(5, 51, 200))

    doc.hero(
        "Useritium",
        "Votre identité numérique française",
        subtitle="Gratuit · Hébergé en France · Open source",
        stats=[
            ("8+", "Projets connectés"),
            ("100%", "Hébergé en France"),
            ("0 €", "Gratuit"),
        ],
    )

    # Ecosystem
    doc.section_bar("L'écosystème")
    doc.h2("7 projets connectés à votre compte Useritium")

    ecosystem = [
        ("Tyrolium", "La holding technologique française. Développement, infrastructure, incubation."),
        ("SolidServ", "Hébergement souverain français. Vos serveurs et infrastructure 100% sur le territoire français."),
        ("NexiumiaCRM", "Le CRM professionnel made in France. Contacts, pipeline commercial et activité en un seul outil."),
        ("TyroCiel", "Le studio de jeu-vidéo de Tyrolium. Accédez aux jeux du studio et retrouvez vos amis."),
        ("TyroServ", "Le serveur Minecraft de Tyrolium. Gérez votre compte, grades et cosmétiques."),
        ("Influnias", "La plateforme de mise en relation entre créateurs et marques. Votre profil Useritium est votre identité créateur."),
        ("Gamenium", "La plateforme gaming de l'écosystème Tyrolium. Collection, temps de jeu, historique — tout via votre compte."),
    ]
    doc.card_grid(ecosystem, cols=2, card_h=46)

    # Features
    doc.section_bar("Fonctionnalités")
    doc.h2("Un compte, tout Tyrolium")

    features = [
        ("Connexion universelle (SSO)", "Un identifiant unique pour tous les sites de Tyrolium et de ses partenaires. Fini les dizaines de mots de passe."),
        ("Adresse mail chiffrée", "exemple@useritium.fr ou exemple@tyromail.fr. Vos échanges privés, chiffrés, jamais vendus."),
        ("Cloud personnel chiffré", "Photos, documents, fichiers synchronisés sur tous vos appareils. Chiffrement de bout en bout."),
        ("Documents & Notes", "Rédigez, organisez, partagez. Notes, documents et présentations synchronisés partout."),
        ("Panel de prestations", "Suivez en temps réel l'avancement de vos projets avec Tyrolium. Communication directe avec nos équipes."),
        ("Données chiffrées & RGPD", "Vos données ne seront jamais vendues. RGPD, open source, transparent — votre confiance est notre priorité."),
    ]
    doc.card_grid(features, cols=2, card_h=50)

    # Prestations
    doc.section_bar("Prestations Tyrolium")
    doc.h2("Nos services professionnels")

    prestations = [
        ("Développement Informatique",
         "Sites vitrine & e-commerce · Applications web métier · API & intégrations"),
        ("Infrastructure & Cloud",
         "Hébergement haute disponibilité · DevOps & automatisation · Monitoring & sécurité"),
        ("Incubateur de projet",
         "Mentorat & accompagnement · Réseau & partenaires · Pilotage de projet"),
    ]
    doc.card_grid(prestations, cols=2, card_h=48)

    # Independence
    doc.section_bar("Notre indépendance")
    independence = [
        ("Aucun actionnaire",           "100% auto-fondé."),
        ("Aucun investissement externe", "Financé par nos propres moyens."),
        ("Aucune levée de fonds",        "Jamais dilués, jamais contraints."),
        ("Liberté créative totale",      "Nos règles, notre vision."),
    ]
    doc.card_grid(independence, cols=2, card_h=38)

    doc.info_note(
        "Useritium est développé en France, hébergé en France, conçu pour les Français. "
        "Vos données vous appartiennent — et elles restent sur notre sol."
    )

    path = os.path.join(DIST, "useritium.pdf")
    doc.output(path)
    print(f"PDF généré : {path}")


# ── Gamenium ──────────────────────────────────────────────────────────────────

def build_gamenium():
    doc = Base("P", "mm", "A4")
    doc.new_doc("Gamenium", accent=(220, 38, 38))

    doc.hero(
        "Gamenium",
        "SaaS 100% gratuit",
        subtitle="La plateforme gaming de l'écosystème Tyrolium.\nConnexion via votre compte Useritium — aucune inscription supplémentaire.",
    )

    # Features
    doc.section_bar("Fonctionnalités")
    doc.h2("Trois outils pour les joueurs")

    features = [
        ("Actualités JV", "Restez informé de toute l'actualité jeu vidéo. Parcourez articles, tests et annonces de toute l'industrie."),
        ("Ma Collection", "Cataloguez toute votre ludothèque dans les moindres détails : plateformes, statut, notes, complétion et plus encore."),
        ("Référence Jeux", "Recherchez et explorez une vaste base de données de jeux : développeurs, genres, dates de sortie, notes et détails."),
    ]
    doc.card_grid(features, cols=2, card_h=52)

    # How it works
    doc.section_bar("Comment ça marche")
    doc.h2("Démarrer en 3 étapes")
    steps = [
        ("01", "Connectez-vous avec Useritium", "Utilisez votre compte Useritium existant — pas de nouvelle inscription nécessaire."),
        ("02", "Explorez la plateforme", "Parcourez les actualités JV, explorez la base de référence de jeux librement."),
        ("03", "Construisez votre collection", "Ajoutez vos jeux, personnalisez chaque champ et suivez votre parcours de joueur en détail."),
    ]
    for num, title, desc in steps:
        doc.step_row(num, title, desc)

    # Sections detail
    doc.section_bar("Détail des sections")

    doc.h3("Actualités JV")
    doc.body(
        "Gamenium agrège les dernières actualités du jeu vidéo de toute l'industrie. "
        "Retrouvez articles, tests et annonces en un seul endroit, sans publicité ni traçage."
    )
    doc.divider()

    doc.h3("Ma Collection")
    doc.body(
        "Créez et gérez votre bibliothèque de jeux personnelle. "
        "Suivez le statut (pas commencé, en cours, terminé, platine), notez chaque jeu, "
        "indiquez la plateforme et le taux de complétion. Tout est synchronisé via votre compte Useritium."
    )
    doc.divider()

    doc.h3("Référence Jeux")
    doc.body(
        "Explorez une vaste base de données de jeux vidéo. "
        "Recherchez par titre, développeur, genre ou année de sortie. "
        "Accédez aux fiches complètes avec notes agrégées et détails techniques."
    )

    doc.info_note(
        "Gamenium est 100% gratuit. Aucun abonnement, aucun achat in-app. "
        "Disponible sur app.gamenium.fr via votre compte Useritium."
    )

    path = os.path.join(DIST, "gamenium.pdf")
    doc.output(path)
    print(f"PDF généré : {path}")


# ── Vturias ───────────────────────────────────────────────────────────────────

def build_vturias():
    doc = Base("P", "mm", "A4")
    doc.new_doc("Vturias", accent=(217, 70, 160))

    doc.hero(
        "Vturias",
        "L'agence VTubing française",
        subtitle="L'agence de VTubing professionnelle en France.\nDédiée à la création, la promotion et l'essor des talents virtuels francophones.",
    )

    # About
    doc.section_bar("À propos")
    doc.h2("Bienvenue chez Vturias")
    doc.body(
        "Nous sommes une agence dédiée à la création, à la promotion et à l'essor des talents virtuels. "
        "Nous croyons que chacun a une histoire unique à partager, et notre mission est de donner vie à ces récits."
    )
    about_cards = [
        ("Accompagnement", "Nous accompagnons chaque VTuber à chaque étape de son parcours, du début à la croissance."),
        ("Promotion", "Nous amplifions votre portée grâce à une promotion stratégique sur toutes les plateformes."),
        ("Communauté", "Rejoignez une communauté dynamique de créateurs virtuels et de fans passionnés."),
    ]
    doc.card_grid(about_cards, cols=2, card_h=46)

    # Talents
    doc.section_bar("Nos Talents")
    doc.h2("4 talents Vturias")
    doc.body("Découvrez les personnalités extraordinaires qui font briller Vturias.")

    talents = [
        ("AuroreTVv", "Vampire / Chat — Anniversaire : 26 avril",
         "VTuber vampire/chat depuis 3 ans, aime partager sa passion pour le jeu vidéo et surtout pour les jeux d'horreur. Traits : Attachante · Râleuse · Leadeuse. Plateformes : Twitch, YouTube, TikTok, Instagram, X, Discord."),
        ("Jiangshi Noni", "Zombie — Anniversaire : 16 octobre",
         "Vtubeuse timide qui aime jouer, même si elle est un peu nulle. Elle adore les jeux d'énigmes, les RPG et les jeux rétro, surtout Kingdom Hearts. Traits : Timide · Peureuse · Énergique · Créatif."),
        ("Damnyts", "Dragon — Anniversaire : 25 mai",
         "Jeune et joyeux dragon en quête d'aventures périlleuses. Amateur de belles histoires et de jeux en tous genres. Traits : Doux · Curieux · Optimiste · Colérique."),
        ("VMaxime", "Humain Banal — Anniversaire : 9 décembre",
         "Voyage entre notre monde et celui des VTubers pour créer des émissions qui parlent de tous les univers. Traits : Leadership · Premier Degré · Arrogant · Charismatique."),
    ]
    for name, subtitle_t, desc in talents:
        doc.guard(40)
        y0 = self = doc.get_y()
        pw = doc.w - doc.l_margin - doc.r_margin
        doc.set_fill_color(*LIGHT)
        doc.set_draw_color(*BORDER)
        doc.set_line_width(0.25)
        doc.rect(doc.l_margin, y0, pw, 38, "FD")
        doc.set_fill_color(217, 70, 160)
        doc.rect(doc.l_margin, y0, 3, 38, "F")
        doc.set_xy(doc.l_margin + 7, y0 + 3)
        doc._f("B", 10.5)
        doc.set_text_color(*BLUE)
        doc.cell(pw - 7, 6, name)
        doc.set_xy(doc.l_margin + 7, y0 + 10)
        doc._f("I", 9)
        doc.set_text_color(*MUTED)
        doc.cell(pw - 7, 5, subtitle_t)
        doc.set_xy(doc.l_margin + 7, y0 + 17)
        doc._f("R", 8.5)
        doc.set_text_color(*TEXT)
        doc.multi_cell(pw - 10, 4.5, desc)
        doc.set_y(y0 + 42)

    # Services
    doc.section_bar("Nos Services")
    doc.h2("Tout ce dont un VTuber a besoin")
    doc.body("Des débuts à la reconnaissance, Vturias vous accompagne à chaque étape.")

    services = [
        ("Gestion des Talents", "Accompagnement personnalisé, gestion des contrats et orientation stratégique de carrière pour chaque talent."),
        ("Production de Contenu", "Overlays de stream, assets 2D/3D, montage vidéo et support technique complet pour des streams de qualité."),
        ("Marketing & Partenariats", "Partenariats de marque, contenus sponsorisés, apparitions en événements et promotion ciblée sur toutes les plateformes."),
        ("Animation de Communauté", "Gestion du Discord, stratégies d'engagement et événements pour bâtir une fanbase fidèle et dynamique."),
    ]
    doc.card_grid(services, cols=2, card_h=50)

    # Join
    doc.section_bar("Nous rejoindre")
    doc.h2("4 étapes simples pour rejoindre Vturias")
    join_steps = [
        ("1", "Candidature", "Envoyez-nous votre profil et votre projet."),
        ("2", "Entretien", "Un échange pour mieux vous connaître et cerner votre vision."),
        ("3", "Débuts", "Votre lancement officiel, soutenu par toute l'équipe."),
        ("4", "Croissance", "Un accompagnement continu pour développer votre audience et votre carrière."),
    ]
    for num, title, desc in join_steps:
        doc.step_row(num, title, desc)

    doc.info_note(
        "Candidatures ouvertes. Que ce soit pour envisager une collaboration ou simplement pour nous faire part de vos projets, "
        "nous sommes impatients de recevoir de vos nouvelles. Contact via tyrolium.fr/contact?from=vturias"
    )

    path = os.path.join(DIST, "vturias.pdf")
    doc.output(path)
    print(f"PDF généré : {path}")


# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    os.makedirs(DIST, exist_ok=True)

    build_solidserv()
    build_nexiumiacrm()
    build_tyroserv()
    build_tyrociel()
    build_influnias()
    build_useritium()
    build_gamenium()
    build_vturias()

    print("\nTous les PDFs filiales ont été générés dans dist/")
