from fpdf import FPDF
import textwrap

class PDF(FPDF):
    def header(self):
        # Arial bold 15
        self.set_font('Arial', 'B', 15)
        # Title
        self.cell(0, 10, 'Yard Guard Landscaping: Strategic Dominance Plan 2026', 0, 1, 'C')
        self.ln(5)

    def footer(self):
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        # Arial italic 8
        self.set_font('Arial', 'I', 8)
        # Page number
        self.cell(0, 10, 'Page ' + str(self.page_no()) + '/{nb}', 0, 0, 'C')

    def chapter_title(self, num, label):
        # Arial 12
        self.set_font('Arial', 'B', 12)
        # Background color
        self.set_fill_color(200, 220, 255)
        # Title
        self.cell(0, 6, '%s : %s' % (num, label), 0, 1, 'L', 1)
        # Line break
        self.ln(4)

    def chapter_body(self, body):
        # Times 11
        self.set_font('Arial', '', 11)
        # Output justified text
        self.multi_cell(0, 5, body)
        # Line break
        self.ln()
    
    def section_header(self, title):
        self.set_font('Arial', 'B', 11)
        self.cell(0, 6, title, 0, 1, 'L')
        self.ln(2)

pdf = PDF()
pdf.alias_nb_pages()
pdf.add_page()

# --- INTRODUCTION ---
pdf.chapter_title('1', 'Executive Summary: The Platform Shift')
text = (
    "The GTA artificial turf market is becoming a commodity race. "
    "Competitors like SynTurf and Fieldmasters are fighting over price per square foot. "
    "Yard Guard cannot win that war. \n\n"
    "To dominate, Yard Guard must pivot from being a 'Service Company' (we install grass) "
    "to a 'Lifestyle Platform' (we curate outdoor living). \n\n"
    "This plan outlines 5 Strategic Pillars to achieve market dominance by 2026, "
    "focusing on High-Tech Sales, Recurring Revenue, and Hyper-Local Guerrilla Marketing."
)
pdf.chapter_body(text)

# --- PILLAR 2: DIGITAL FLANK ---
pdf.chapter_title('2', 'Digital Strategy: The "Hyper-Local" Moat')
text = (
    "Digital competitors are broad. We will be deep. \n\n"
    "STRATEGY: The 'City-State' Landing Pages \n"
    "Instead of one website, we create 'Micro-Sites' for specific high-value neighborhoods. \n\n"
    "EXAMPLE ARCHITECTURE: \n"
    "- /mississauga/lorne-park-artificial-turf (Target: $2M+ homes, large lots) \n"
    "- /oakville/glen-abbey-putting-greens (Target: Golfers) \n"
    "- /etobicoke/kingsway-pet-turf (Target: Dog owners with muddy yards) \n\n"
    "INNOVATION: 'The 48-Hour Quote Challenge' \n"
    "We add a badge to the site: 'Get a 3D Design & Quote in 48 Hours, or we give you $500 off your install.' "
    "This creates urgency and highlights our tech advantage over slow competitors."
)
pdf.chapter_body(text)

# --- PILLAR 3: CARE CLUB ---
pdf.chapter_title('3', 'Revenue Engine: The Care Club 2.0')
text = (
    "Transform one-time buyers into lifetime subscribers. \n\n"
    "THE TIERS: \n"
    "1. SILVER ($29/mo): Spring Power-Broom + Fall Leaf Blow + 1-Year Warranty Extension. \n"
    "2. GOLD ($49/mo): All of above + Summer 'Enzyme Deep Clean' (Odor removal). \n"
    "3. PLATINUM ($99/mo): The 'Hands-Free' package. Includes Snow Clearing of the turf path in winter. \n\n"
    "INNOVATION: 'The Poop Patrol' Add-On \n"
    "Partner with a local pooper-scooper service. Offer a bundled 'Turf + Waste Removal' subscription. "
    "We become the single vendor for their backyard hygiene."
)
pdf.chapter_body(text)

# --- PILLAR 4: SALES PSYCHOLOGY ---
pdf.chapter_title('4', 'Sales Innovation: Removing Friction')
text = (
    "The biggest barrier to sale is 'Uncertainty'. \n\n"
    "INNOVATION 1: The 'Try-Before-You-Buy' Mat Program \n"
    "We drop off a 5'x5' premium turf mat at the qualified lead's house for a weekend. "
    "Let them walk on it barefoot. Let the dog pee on it. "
    "Once they live with it, they buy it. \n\n"
    "INNOVATION 2: The 'Upload Your Yard' Funnel \n"
    "Current Process: Call -> Wait -> Visit -> Quote. (Friction!) \n"
    "New Process: User takes photo on phone -> Uploads to site -> AI/Team overlays turf -> Sends back 'After' photo within 4 hours. \n"
    "Instant dopamine hit. Incredible conversion tool."
)
pdf.chapter_body(text)

# --- PILLAR 5: NICHE DOMINATION ---
pdf.chapter_title('5', 'Niche Packages: Beyond The Lawn')
text = (
    "Don't sell 'grass'. Sell 'solutions'. \n\n"
    "PACKAGE A: 'The Augusta' (For Golfers) \n"
    "- Tour-quality putting surface (Stimp 10-12). \n"
    "- Undulated breaks designed by a golf pro consultant. \n"
    "- Includes a 'Practice Routine' video guide. \n\n"
    "PACKAGE B: 'The Paw-Proof' (For Dog Owners) \n"
    "- Antimicrobial infill (Zeolfill). \n"
    "- Reinforced steel edging (Dig-proof). \n"
    "- The 'Bad Dog' Warranty: If they dig through it, we patch it free. \n\n"
    "PACKAGE C: 'The Smart Yard' (Tech Bundle) \n"
    "- Turf + Smart Irrigation (for cooling) + Phillips Hue Outdoor Lighting + Sonos Speakers. \n"
    "- One app controls the entire backyard ambience."
)
pdf.chapter_body(text)

# --- PILLAR 6: PARTNERSHIPS ---
pdf.chapter_title('6', 'The Ecosystem: Lead Arbitrage')
text = (
    "Monetize the leads we can't service. \n\n"
    "PROTOCOL: \n"
    "1. Vet 1 Pool Builder, 1 Deck Builder, 1 Fence Builder. \n"
    "2. The Deal: We are the 'General Contractor' of the backyard. "
    "We take the deposit, they do the work, we keep 15%. \n"
    "3. The Pitch: 'One Throat to Choke'. The homeowner gets ONE invoice and ONE project manager (Us). \n\n"
    "TARGET PARTNER: \n"
    "Pool Installers are the Holy Grail. They destroy yards. "
    "We pitch them: 'We are your Restoration Division. We fix the mess you make within 48 hours.'"
)
pdf.chapter_body(text)

# --- CONCLUSION ---
pdf.chapter_title('7', 'Implementation Timeline')
text = (
    "Phase 1 (Immediate): Launch 'Upload Your Yard' funnel + 'Mississauga' Landing Pages. \n"
    "Phase 2 (Spring): Roll out 'Care Club' to all past installs. \n"
    "Phase 3 (Summer): Launch 'Try-Before-You-Buy' mat program. \n\n"
    "Success Metric: $2M Revenue + 20% Recurring Revenue by Dec 2026."
)
pdf.chapter_body(text)

pdf.output('/Users/developer/projects/YardGuard/Yard_Guard_Strategic_Dominance_Plan.pdf', 'F')
