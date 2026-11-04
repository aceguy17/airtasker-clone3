/** Demo task templates used to seed the database. Edit freely. */

export type SampleTask = {
  title: string;
  description: string;
  categoryId: string;
  mode: "in-person" | "remote";
  suburb: string;
  budgetType: "fixed" | "hourly" | "open";
  budget: number | null;
};

const C = {
  cleaning: "c_cleaning",
  handyman: "c_handyman",
  assembly: "c_assembly",
  moving: "c_moving",
  gardening: "c_gardening",
  painting: "c_painting",
  tech: "c_tech",
  pets: "c_pets",
  tutoring: "c_tutoring",
  admin: "c_admin",
};

export const SAMPLE_TASKS: SampleTask[] = [
  { title: "End-of-lease deep clean, 2 bedroom flat", description: "Full clean for bond return: oven, fridge, bathrooms, skirting boards and windows. Supplies on site.", categoryId: C.cleaning, mode: "in-person", suburb: "Fitzroy", budgetType: "fixed", budget: 220 },
  { title: "Weekly apartment clean", description: "One-bedroom apartment, vacuum, mop and bathroom clean every Thursday. Keys can be arranged.", categoryId: C.cleaning, mode: "in-person", suburb: "Southbank", budgetType: "hourly", budget: 45 },
  { title: "Post-party clean-up", description: "Kitchen and living room need tidying after a party. Dishes, bins and floors. About 3 hours.", categoryId: C.cleaning, mode: "in-person", suburb: "Brunswick", budgetType: "open", budget: null },
  { title: "Carpet steam clean, lounge and hallway", description: "About 40 square metres of carpet. Machine on site is not needed, but you must bring a steam cleaner.", categoryId: C.cleaning, mode: "in-person", suburb: "Coburg", budgetType: "fixed", budget: 150 },
  { title: "Window cleaning, two-storey house", description: "Inside and outside windows, around 24 panes including French doors. Ladder access at the back.", categoryId: C.cleaning, mode: "in-person", suburb: "Hawthorn", budgetType: "open", budget: null },
  { title: "Flat-pack bed frame assembly", description: "Queen bed frame with slats and side rails. Instructions in English. Bring your own drill.", categoryId: C.assembly, mode: "in-person", suburb: "Carlton", budgetType: "fixed", budget: 70 },
  { title: "Assemble standing desk and chair", description: "Electric sit-stand desk plus an office chair. Both boxes are in the spare room.", categoryId: C.assembly, mode: "in-person", suburb: "Docklands", budgetType: "fixed", budget: 90 },
  { title: "Kids' cubby house assembly", description: "Wooden cubby house, about 2 metres tall. Needs two people for the roof panels.", categoryId: C.assembly, mode: "in-person", suburb: "Ringwood", budgetType: "open", budget: null },
  { title: "Mount TV and sound bar on wall", description: "65-inch TV on plasterboard wall, sound bar underneath. Brackets are supplied, cable concealment wanted.", categoryId: C.assembly, mode: "in-person", suburb: "Kew", budgetType: "fixed", budget: 120 },
  { title: "Gym equipment assembly", description: "Power rack and adjustable bench. Full set of parts and tools on site. Takes about 4 hours.", categoryId: C.assembly, mode: "in-person", suburb: "Preston", budgetType: "fixed", budget: 160 },
  { title: "Fix leaking kitchen tap", description: "Mixer tap drips constantly. Need a replacement cartridge fitted, parts will be bought by the Tasker.", categoryId: C.handyman, mode: "in-person", suburb: "Footscray", budgetType: "fixed", budget: 130 },
  { title: "Patch holes in hallway plaster", description: "Three nail holes and one larger dent to fill and sand, ready for painting.", categoryId: C.handyman, mode: "in-person", suburb: "Thornbury", budgetType: "open", budget: null },
  { title: "Replace bathroom exhaust fan", description: "Old fan is noisy and not working. New fan is already bought. Needs an electrician-safe installation.", categoryId: C.handyman, mode: "in-person", suburb: "Malvern", budgetType: "fixed", budget: 200 },
  { title: "Hang pictures and mirrors", description: "Eight items to hang, including one large mirror in the bathroom. Bring your own tools.", categoryId: C.handyman, mode: "in-person", suburb: "St Kilda", budgetType: "hourly", budget: 55 },
  { title: "Install garden shed door lock", description: "Shed door needs a new deadbolt and hinge adjustment. Hardware supplied.", categoryId: C.handyman, mode: "in-person", suburb: "Glen Iris", budgetType: "fixed", budget: 60 },
  { title: "Move a sofa across town", description: "Three-seater sofa from a 2nd-floor walk-up in Collingwood to a house in Northcote.", categoryId: C.moving, mode: "in-person", suburb: "Collingwood", budgetType: "open", budget: null },
  { title: "Two-person flat move, one bedroom", description: "Boxes, a bed, a dining table and a fridge. Van is organised. Need help loading and unloading.", categoryId: C.moving, mode: "in-person", suburb: "Prahran", budgetType: "hourly", budget: 65 },
  { title: "Pick up flat-pack from IKEA", description: "Collect a wardrobe and a desk from Tempe and deliver to Brighton. Ute or van required.", categoryId: C.moving, mode: "in-person", suburb: "Brighton", budgetType: "fixed", budget: 85 },
  { title: "Storage unit clear-out", description: "Sort, box and take unwanted items to the tip from a small storage unit in Dandenong.", categoryId: C.moving, mode: "in-person", suburb: "Dandenong", budgetType: "open", budget: null },
  { title: "Courier-style parcel delivery", description: "Drop a box of documents at a law office in the CBD before 3pm. Signature required.", categoryId: C.moving, mode: "in-person", suburb: "Melbourne CBD", budgetType: "fixed", budget: 35 },
  { title: "Fortnightly lawn mowing", description: "Front and back lawn, about 300 square metres. Edging and blowing paths included.", categoryId: C.gardening, mode: "in-person", suburb: "Essendon", budgetType: "fixed", budget: 60 },
  { title: "Prune hedges and trim trees", description: "Two large hedges along the fence and a small apple tree. Green waste to be removed.", categoryId: C.gardening, mode: "in-person", suburb: "Camberwell", budgetType: "open", budget: null },
  { title: "Garden bed weeding and mulch", description: "Weed three raised beds and spread mulch. Mulch is already delivered to the driveway.", categoryId: C.gardening, mode: "in-person", suburb: "Elwood", budgetType: "fixed", budget: 110 },
  { title: "Plant and set up vegetable garden", description: "Build four timber garden beds and plant seedlings. Materials will be bought in advance.", categoryId: C.gardening, mode: "in-person", suburb: "Northcote", budgetType: "hourly", budget: 50 },
  { title: "Gutter clean-out", description: "Single-storey house, all gutters full of leaves. Ladder and downpipe clearing needed.", categoryId: C.gardening, mode: "in-person", suburb: "Ivanhoe", budgetType: "fixed", budget: 140 },
  { title: "Paint two bedrooms, ceilings included", description: "Two bedrooms, roughly 3.5 x 4 metres each. Walls and ceilings in white. Paint is supplied.", categoryId: C.painting, mode: "in-person", suburb: "Balwyn", budgetType: "fixed", budget: 600 },
  { title: "Exterior fence repaint", description: "Timber paling fence, approximately 20 metres, one coat of stain. Sanding included.", categoryId: C.painting, mode: "in-person", suburb: "Oakleigh", budgetType: "open", budget: null },
  { title: "Touch-up paint in hallway and stairs", description: "Scuffs and marks on walls up the staircase. Same paint colour as the rest of the house.", categoryId: C.painting, mode: "in-person", suburb: "Brighton East", budgetType: "hourly", budget: 50 },
  { title: "Kitchen cabinet repaint", description: "Twelve cabinet doors need sanding and a two-coat finish in matt white. Doors are off the hinges.", categoryId: C.painting, mode: "in-person", suburb: "Moonee Ponds", budgetType: "fixed", budget: 480 },
  { title: "Set up home Wi-Fi mesh network", description: "Mesh kit to configure and place across three levels. Remote help over a video call is fine.", categoryId: C.tech, mode: "remote", suburb: "Remote", budgetType: "open", budget: null },
  { title: "Recover a hacked Facebook account", description: "Account locked after a suspicious login. Need help with Meta's recovery process and securing it.", categoryId: C.tech, mode: "remote", suburb: "Remote", budgetType: "fixed", budget: 50 },
  { title: "Set up a new laptop and printer", description: "New laptop needs email, backups and a printer connected. Old files are on an external drive.", categoryId: C.tech, mode: "in-person", suburb: "Hawthorn", budgetType: "hourly", budget: 60 },
  { title: "Build a simple one-page website", description: "Single page for a local bakery: menu, opening hours, map and a contact form. Content is ready.", categoryId: C.tech, mode: "remote", suburb: "Remote", budgetType: "fixed", budget: 400 },
  { title: "Smart home devices setup", description: "Install and link smart lights, a doorbell camera and a thermostat to one app.", categoryId: C.tech, mode: "in-person", suburb: "Doncaster", budgetType: "open", budget: null },
  { title: "Dog walking, twice a day", description: "Medium-sized friendly dog, 30 minutes each walk on weekdays. Experience with dogs preferred.", categoryId: C.pets, mode: "in-person", suburb: "Kensington", budgetType: "fixed", budget: 300 },
  { title: "Cat sitter for a long weekend", description: "Two indoor cats, feeding, litter and some playtime. Check-ins morning and evening.", categoryId: C.pets, mode: "in-person", suburb: "Williamstown", budgetType: "fixed", budget: 120 },
  { title: "Puppy training basics", description: "Eight-week-old puppy needs help with toilet training and basic commands. Weekly sessions.", categoryId: C.pets, mode: "in-person", suburb: "Ascot Vale", budgetType: "hourly", budget: 40 },
  { title: "Aquarium maintenance", description: "Fortnightly water change and filter clean for a 300-litre tank. Equipment is on site.", categoryId: C.pets, mode: "in-person", suburb: "Ashburton", budgetType: "open", budget: null },
  { title: "Year 10 maths tutoring", description: "Weekly one-hour session before exams, focused on algebra and trigonometry. Students are in Year 10.", categoryId: C.tutoring, mode: "in-person", suburb: "Box Hill", budgetType: "hourly", budget: 60 },
  { title: "English essay editing and feedback", description: "Editing and feedback on a 2,000-word university essay. Due in one week. Remote is fine.", categoryId: C.tutoring, mode: "remote", suburb: "Remote", budgetType: "fixed", budget: 80 },
  { title: "Guitar lessons for an adult beginner", description: "Weekly 45-minute lessons at home. Acoustic guitar, learning chords and simple songs.", categoryId: C.tutoring, mode: "in-person", suburb: "Thornbury", budgetType: "hourly", budget: 50 },
  { title: "Conversational Spanish practice", description: "Weekly online practice for an intermediate learner preparing for a trip. Relaxed conversation.", categoryId: C.tutoring, mode: "remote", suburb: "Remote", budgetType: "hourly", budget: 35 },
  { title: "Coding help with Python script", description: "Need someone to explain and fix a Python script that processes spreadsheets. Remote session.", categoryId: C.tutoring, mode: "remote", suburb: "Remote", budgetType: "open", budget: null },
  { title: "Admin support: inbox and calendar", description: "Sort email, schedule meetings and send follow-up reminders for a small business. About 10 hours a week.", categoryId: C.admin, mode: "remote", suburb: "Remote", budgetType: "hourly", budget: 40 },
  { title: "Data entry from scanned invoices", description: "About 120 scanned invoices to enter into a spreadsheet. Template provided. Remote work.", categoryId: C.admin, mode: "remote", suburb: "Remote", budgetType: "fixed", budget: 180 },
  { title: "Research 20 local suppliers", description: "Build a list of suppliers with contact details and pricing for a catering business. Spreadsheet output.", categoryId: C.admin, mode: "remote", suburb: "Remote", budgetType: "fixed", budget: 150 },
  { title: "Proofread a 30-page report", description: "Grammar and style check on a company report. Track changes in Word. Needs to be back in 3 days.", categoryId: C.admin, mode: "remote", suburb: "Remote", budgetType: "open", budget: null },
  { title: "Tax return document organising", description: "Sort receipts and bank statements into folders for the accountant. Paper and digital files.", categoryId: C.admin, mode: "in-person", suburb: "South Yarra", budgetType: "hourly", budget: 45 },
  { title: "Weekly ironing, about 20 items", description: "Shirts, blouses and a few trousers each week. Pick-up and drop-off in Kew, or do it on site.", categoryId: C.cleaning, mode: "in-person", suburb: "Kew", budgetType: "fixed", budget: 40 },
  { title: "Build a monthly budget spreadsheet", description: "Simple spreadsheet with income, bills, savings and a dashboard tab. Template ideas welcome.", categoryId: C.admin, mode: "remote", suburb: "Remote", budgetType: "fixed", budget: 120 },
];
