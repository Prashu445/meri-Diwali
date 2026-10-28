// src/data/diwaliData.js

export const JOURNEY_STEPS = [
  { step: 1, id: 'decor', title: 'Step 1: Ghar Sajao (Home Decor)', hi: 'Main gate par Rangoli banayein, 6 kono mein Diye jalayein aur Jhalar lagayein.' },
  { step: 2, id: 'shopping', title: 'Step 2: Market Se Patake Kharido', hi: 'Mohalla market ki 3 dukaano se Phuljhari, Anar, Chakri, Sutli Bomb aur Rocket lein.' },
  { step: 3, id: 'puja', title: 'Step 3: Lakshmi-Ganesh Puja', hi: 'Puja ghar mein Diya jalayein, Pushpanjali dein, Aarti Thali ghumayein aur Bhog lagayein.' },
  { step: 4, id: 'sanathi', title: 'Step 4: Sanathi (Hukka-Pati) Ritual (120s)', hi: 'Puja ke baad Sanathi jalayein, 4 kono mein "लक्ष्मी घर दरिद्र बाहर" bolein aur bahar aag kudien.' },
  { step: 5, id: 'crackers', title: 'Step 5: Burst Patake (Gali / Rooftop)', hi: 'Niche pataka bar ya 🛍️ Bag se patake chunein aur aasman mein aatishbazi karein.' },
  { step: 6, id: 'dinner', title: 'Step 6: Family Diwali Dinner', hi: 'Dining room mein parivaar ke sath baith kar Diwali ke pakwan aur mithai khayein.' },
];

export const DECOR_SPOTS = [
  { id: 'rangoli_main', type: 'rangoli', label: '🎨 Step 1: Draw Entrance Rangoli [E]', toastTitle: 'Drew Vibrant Entrance Rangoli!', toastSub: 'Main gate welcome Rangoli is ready.', pos: [0, 0.06, 5.4], floor: 'Ground Floor' },
  { id: 'diya_gf_left', type: 'diya', label: '🪔 Step 1: Light Diya (Ground Floor) [E]', toastTitle: 'Lit Diya at Ground Courtyard Left Corner!', toastSub: 'Clay Diya glowing brightly.', pos: [-4.6, 0.25, 3.6], floor: 'Ground Floor' },
  { id: 'diya_gf_right', type: 'diya', label: '🪔 Step 1: Light Diya (Ground Floor) [E]', toastTitle: 'Lit Diya at Ground Courtyard Right Corner!', toastSub: 'Clay Diya glowing brightly.', pos: [4.6, 0.25, 3.6], floor: 'Ground Floor' },
  { id: 'diya_ff_left', type: 'diya', label: '🪔 Step 1: Light Diya (First Floor) [E]', toastTitle: 'Lit Diya at First Floor Balcony West!', toastSub: 'Clay Diya glowing brightly.', pos: [-4.5, 4.1, 3.4], floor: 'First Floor' },
  { id: 'diya_ff_right', type: 'diya', label: '🪔 Step 1: Light Diya (First Floor) [E]', toastTitle: 'Lit Diya at First Floor Balcony East!', toastSub: 'Clay Diya glowing brightly.', pos: [4.5, 4.1, 3.4], floor: 'First Floor' },
  { id: 'diya_roof_left', type: 'diya', label: '🪔 Step 1: Light Diya (Rooftop) [E]', toastTitle: 'Lit Diya at Rooftop West Parapet!', toastSub: 'Clay Diya glowing brightly.', pos: [-4.5, 7.9, 3.2], floor: 'Rooftop' },
  { id: 'diya_roof_right', type: 'diya', label: '🪔 Step 1: Light Diya (Rooftop) [E]', toastTitle: 'Lit Diya at Rooftop East Parapet!', toastSub: 'Clay Diya glowing brightly.', pos: [4.5, 7.9, 3.2], floor: 'Rooftop' },
  { id: 'lights_balcony', type: 'lights', label: '🌸 Step 1: Hang Lights & Flowers [E]', toastTitle: 'Hung Fairy Lights (Jhalar) & Genda Garlands!', toastSub: 'House facade is glowing with festive lights.', pos: [0, 4.1, 3.6], floor: 'First Floor' },
];

export const SHOPS_DATA = [
  {
    id: 'shop_1',
    name: 'Raju Pataka Bhandar',
    badgeLabel: '🧨 Raju Pataka Bhandar [E]',
    owner: 'Raju Bhai',
    avatar: '🧔🏽‍♂️',
    pos: [-10, 0, 13.5],
    roofColor: '#dc2626',
    baseColor: '#7c2d12',
    greeting: 'आइए भैया! बोलिए क्या दूँ?',
    speechGreeting: 'Aaiye bhaiya! Boliye kya du?',
  },
  {
    id: 'shop_2',
    name: 'Laxmi Fireworks',
    badgeLabel: '🎇 Laxmi Fireworks [E]',
    owner: 'Laxmi Chachi',
    avatar: '👩🏽‍🦳',
    pos: [0, 0, 15.5],
    roofColor: '#d97706',
    baseColor: '#78350f',
    greeting: ' बेटा! अनार ले जाओ।',
    speechGreeting: ' beta!  anar le jao.',
  },
  {
    id: 'shop_3',
    name: 'Chhotu Rocket Wala',
    badgeLabel: '🚀 Chhotu Rocket Wala [E]',
    owner: 'Chhotu',
    avatar: '👦🏽',
    pos: [10, 0, 13.5],
    roofColor: '#7c3aed',
    baseColor: '#4c1d95',
    greeting: 'ओये भैया!  रॉकेट यहाँ हैं!',
    speechGreeting: 'Oye bhaiya!  rocket yahan hain!',
  },
];

export const FAMILY_MEMBERS = [
  { id: 'papa', name: 'Papa Ji', avatar: '👨🏽‍🦳', role: 'Head of Family', line: ' सब लोग गरमा-गरम पूड़ी और पनीर लो', speechLine: 'Sab log garma-garam poori aur paneer lo' },
  { id: 'mummy', name: 'Mummy Ji', avatar: '👩🏽', role: 'Annapurna', line: ' पेट भर के खाना', speechLine: ' Pet bhar ke khana' },
  { id: 'didi', name: 'Badi Didi', avatar: '👩🏽‍🦱', role: 'Rangoli Expert', line: 'आज की रंगोली सबसे अच्छी लगी ', speechLine: 'Aaj ki rangoli sabse achhi lagi' },
  { id: 'bhaiya', name: 'Chhota Bhaiya', avatar: '👦🏽', role: 'Pataka Champion', line: ' ममी एक और गुलाब जामुन दो ना', speechLine:  'Mummy ek aur gulab jamun do na' },
  { id: 'you', name: 'Aap (Player)', avatar: '🧑🏽', role: 'Ghar Ka Beta', line: 'परिवार के साथ बैठ कर दिवाली का भोजन करने का सुख ही सबसे बड़ा है', speechLine: 'Parivaar ke sath baith kar Diwali ka bhojan karne ka sukh hi sabse bada hai' },
];

export const CRACKER_CATALOG = [
  { id: 'bullet', shortName: 'Sutli', name: 'Sutli / Atom Bomb', hindiReq: 'Mujhe Sutli Bomb  de do', icon: '🧨', qtyPack: 3, color: '#ef4444' },
  { id: 'sparkler', shortName: 'Phuljhari', name: 'Phuljhari', hindiReq: 'Mujhe Phuljhari  de do', icon: '✨', qtyPack: 5, color: '#fde047' },
  { id: 'fountain', shortName: 'Anar', name: 'Anar', hindiReq: 'Mujhe Anar  wale patake de do', icon: '🌋', qtyPack: 3, color: '#fb923c' },
  { id: 'spinner', shortName: 'Chakri', name: 'Zameen Chakri', hindiReq: 'Mujhe Chakri (Ground Spinner) de do', icon: '🌀', qtyPack: 4, color: '#4ade80' },
  { id: 'rocket', shortName: 'Rocket', name: 'Sky Rocket', hindiReq: 'Mujhe Sky Rocket de do', icon: '🚀', qtyPack: 3, color: '#38bdf8' },
];

export const SANATHI_CORNERS = [
  { id: 'sanathi_c1', label: '🔥 Purify Puja Room Corner [E]', pos: [-3.0, 0.25, -1.2] },
  { id: 'sanathi_c2', label: '🔥 Purify Dining Room Corner [E]', pos: [3.0, 0.25, -1.2] },
  { id: 'sanathi_c3', label: '🔥 Purify First Floor Balcony [E]', pos: [0, 4.1, 2.5] },
  { id: 'sanathi_c4', label: '🔥 Purify Main Courtyard Gate [E]', pos: [-2.2, 0.25, 4.2] },
];

export const SANATHI_FINALE_POS = [0, 0.08, 9.6];

export const BHAJAN_TRACKS = [
  { id: 1, title: 'Om Jai Lakshmi Mata (Aarti)', artist: 'Main Diwali Aarti', audioUrl: '/audio/aarti.mp3' },
  { id: 2, title: 'Shri Ganesh Stotram', artist: 'Bhajan Sandhya', audioUrl: '/audio/bhajan1.mp3' },
  { id: 3, title: 'Achyutam Keshavam', artist: 'Devotional Melodies', audioUrl: '/audio/bhajan2.mp3' },
  { id: 4, title: 'Deepavali Special Dhun', artist: 'Mohalla Mandir Radio', audioUrl: '/audio/bhajan3.mp3' },
];