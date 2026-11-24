export const DISCLAIMER =
  'Reference guidance only — always confirm final dosage, patient allergies, pregnancy/breastfeeding status, and interactions with a licensed pharmacist or doctor before dispensing.';

export const UNIT_TYPES = ['packet', 'box', 'card', 'bottle', 'tube', 'counting'];

export const STANDARD_CATEGORIES = [
  'Pain Relief',
  'Antibiotic',
  'Antimalarial',
  'Blood Pressure (BP)',
  'Diabetes',
  'Antacid / Digestive',
  'Cough & Cold',
  'Allergy',
  'Vitamins & Tonics',
  'Skin / Topical',
  'Eye / Ear / Nose',
  'Antiseptic / Wound Care',
  'Pediatric',
  'Hepatoprotectant',
  "Women's Health",
  'Anti-parasitics',
  'Antifungals',
  'Oral Rehydration / Electrolytes',
  'Supplements',
  'Other',
];

const MESSY_CATEGORY_ALIASES = new Set(['other', 'bp', 'typhoid', 'skin', 'infection']);

const NON_COMPANY_PARENS = new Set([
  'big', 'small', 'medium', 'large', 'adult', 'adults', 'child', 'children', 'pediatric',
  'paediatric', 'infant', 'softgel', 'tablet', 'tablets', 'tab', 'tabs', 'capsule', 'capsules',
  'cap', 'caps', 'syrup', 'suspension', 'cream', 'gel', 'ointment', 'drops', 'injection',
  'small packet', 'red and yellow capsule', 'metformin', 'paracetamol syrup',
]);

const KNOWN_COMPANIES = [
  'berlin', 'teva', 'biophage', 'panda', 'tuyil', 'erymed', 'becombion', 'zetup',
  'nine seas', 'emzor', 'fidson', 'may & baker', 'm&b', 'gsk', 'pfizer', 'novartis',
  'sanofi', 'swisstools', 'swiss pharma', 'juhel', 'dana', 'neimeth', 'roche',
  'bayer', 'servier', 'astrazeneca', 'mepha', 'hovid', 'shaghai', 'cipla', 'ranbaxy',
  'mekophar', 'orbs', 'dm',
];

export const DRUG_REFERENCE = [
  {
    id: 'paracetamol',
    generic: 'Paracetamol',
    aliases: ['paracetamol', 'pcm', 'panadol', 'panda', 'emzor paracetamol', 'acetaminophen', 'painkil', 'fever', 'headache', 'pain'],
    drugClass: 'Analgesic / Antipyretic (Pain & Fever Reliever)',
    whatItTreats: 'Mild to moderate pain (headache, toothache, body ache) and fever.',
    ageGuidance: {
      infantsChildren: 'Use pediatric drops/syrup dosed strictly by weight/age; avoid adult 500mg tablets in young children.',
      adults: 'Typically 500mg to 1,000mg every 4–6 hours as needed (max 4,000mg in 24 hours).',
      elderly: 'Standard adult dose is usually suitable; use lower maximum daily dose if underweight or frail.',
      pregnancyBreastfeeding: 'Generally considered first-line pain/fever option when needed; confirm dose with pharmacist/doctor.',
    },
    allergiesAndAvoid: 'Do NOT give to anyone with paracetamol allergy, severe liver disease/hepatitis, or chronic heavy alcohol misuse. Check other cold/flu mixes to prevent double-dosing paracetamol.',
    warnings: 'Overdose causes serious liver damage. Never combine multiple paracetamol-containing cold remedies without checking total daily mg.',
  },
  {
    id: 'ibuprofen',
    generic: 'Ibuprofen',
    aliases: ['ibuprofen', 'brufen', 'ibucap', 'brustan', 'advil', 'inflammation', 'toothache', 'period pain', 'arthritis'],
    drugClass: 'NSAID (Anti-inflammatory Pain Reliever)',
    whatItTreats: 'Pain, swelling/inflammation, joint/muscle pain, dental pain, menstrual cramps, and fever.',
    ageGuidance: {
      infantsChildren: 'Pediatric suspension only when age/weight appropriate (usually 3+ months and >=5 kg); avoid in dehydrated children.',
      adults: 'Commonly 200mg–400mg every 6–8 hours AFTER food.',
      elderly: 'Higher risk of stomach bleeding and kidney strain; use lowest effective dose for shortest time.',
      pregnancyBreastfeeding: 'AVOID in pregnancy (especially third trimester — risks to baby heart/kidneys). Generally compatible short-term in breastfeeding; verify first.',
    },
    allergiesAndAvoid: 'Do NOT give to anyone with allergy to ibuprofen/aspirin/NSAIDs, active stomach ulcer or GI bleeding, severe kidney/heart failure, dengue/bleeding risk, or late pregnancy.',
    warnings: 'Always take after food/milk. Avoid stacking with diclofenac, aspirin, or piroxicam.',
  },
  {
    id: 'diclofenac',
    generic: 'Diclofenac',
    aliases: ['diclofenac', 'cataflam', 'voltaren', 'clofenac', 'back pain', 'joint pain', 'arthritis'],
    drugClass: 'NSAID (Strong Anti-inflammatory)',
    whatItTreats: 'Moderate acute pain, muscle sprains, arthritis, gout flare, dental or post-procedure pain.',
    ageGuidance: {
      infantsChildren: 'Not for routine use in young children unless specifically prescribed by a physician.',
      adults: 'Commonly 50mg 2–3 times daily after meals (prescription/pharmacist guidance).',
      elderly: 'Use with extreme caution due to stomach ulcer, BP spike, and kidney injury risk.',
      pregnancyBreastfeeding: 'AVOID in pregnancy (especially 3rd trimester). Ask pharmacist before breastfeeding use.',
    },
    allergiesAndAvoid: 'Avoid in stomach ulcer history, NSAID/aspirin allergy (asthma/hives trigger), kidney/liver impairment, uncontrolled hypertension, or heart disease.',
    warnings: 'Do not combine with other oral NSAIDs (ibuprofen, aspirin, naproxen, meloxicam).',
  },
  {
    id: 'aspirin',
    generic: 'Aspirin / NSAID Combination',
    aliases: ['aspirin', 'anacin', 'vasoprin', 'disprin', 'acetylsalicylic', 'blood thinner'],
    drugClass: 'Salicylate Analgesic / Antiplatelet',
    whatItTreats: 'Pain/headache/migraine (Anacin/standard strength) or blood clot prevention (low-dose 75mg–81mg).',
    ageGuidance: {
      infantsChildren: 'DO NOT GIVE TO CHILDREN OR TEENS under 16–18 years with viral illness/fever (risk of fatal Reye syndrome).',
      adults: 'Take after food with plenty of water; follow label/prescription for dose.',
      elderly: 'Increased stomach bleeding risk; watch for dark stools or bruising.',
      pregnancyBreastfeeding: 'Avoid pain doses in pregnancy (especially 3rd trimester) and avoid during breastfeeding unless specifically prescribed.',
    },
    allergiesAndAvoid: 'Never give to children under 16, anyone with aspirin/NSAID allergy or aspirin-triggered asthma, stomach ulcers, bleeding disorders, or on warfarin/anticoagulants.',
    warnings: 'Check labels for caffeine/aspirin combos (e.g., Anacin) and avoid in peptic ulcer patients.',
  },
  {
    id: 'amoxicillin',
    generic: 'Amoxicillin',
    aliases: ['amoxicillin', 'amoxil', 'amoxyl', 'tuyil', 'moxipen', 'chest infection', 'ear infection', 'bacterial'],
    drugClass: 'Penicillin Antibiotic',
    whatItTreats: 'Bacterial chest, throat, ear, sinus, dental, and urinary infections.',
    ageGuidance: {
      infantsChildren: 'Pediatric suspension dosed strictly by child body weight (mg/kg) per doctor/pharmacist prescription.',
      adults: 'Commonly 250mg–500mg every 8 hours for a full prescribed course (usually 5–7 days).',
      elderly: 'Standard adult dose unless severe kidney impairment requires spacing doses.',
      pregnancyBreastfeeding: 'Generally considered compatible when prescribed for bacterial infection; confirm with prescriber.',
    },
    allergiesAndAvoid: 'STRICTLY AVOID if the patient has ANY PENICILLIN or cephalosporin allergy (rash, swelling, wheezing, anaphylaxis).',
    warnings: 'Always finish the full antibiotic course even after feeling better. Stop immediately and seek emergency care if rash or breathing difficulty starts.',
  },
  {
    id: 'amox_clav',
    generic: 'Amoxicillin/Clavulanate',
    aliases: ['augmentin', 'aquaclav', 'amoksiklav', 'co-amoxiclav', 'clavulanate', 'amox clav', 'fleming'],
    drugClass: 'Penicillin + Beta-Lactamase Inhibitor Antibiotic',
    whatItTreats: 'Resistant bacterial respiratory, urinary, skin, dental, and sinus infections.',
    ageGuidance: {
      infantsChildren: 'Use exact pediatric suspension strength (e.g., 228mg/5ml or 457mg/5ml) calculated by weight.',
      adults: 'Commonly 625mg every 12 hours or 1g every 12 hours at the start of a meal.',
      elderly: 'Adjust only in severe kidney disease; watch for diarrhea.',
      pregnancyBreastfeeding: 'Used when clinically indicated; avoid in suspected premature rupture of membranes without OB review.',
    },
    allergiesAndAvoid: 'STRICTLY AVOID in penicillin/beta-lactam allergy or prior Augmentin-related liver jaundice.',
    warnings: 'Take right at the start of a meal to reduce stomach upset/diarrhea.',
  },
  {
    id: 'ampiclox',
    generic: 'Ampicillin/Cloxacillin',
    aliases: ['ampiclox', 'ampicillin', 'cloxacillin', 'wound infection', 'boil', 'post-surgery'],
    drugClass: 'Penicillin Combination Antibiotic',
    whatItTreats: 'Skin/soft tissue infections, boils, wound infections, and respiratory infections.',
    ageGuidance: {
      infantsChildren: 'Neonatal/pediatric drops or syrup per weight-based prescription.',
      adults: 'Commonly 500mg every 6 hours on an empty stomach (30–60 min before meals).',
      elderly: 'Use standard caution and hydrate well.',
      pregnancyBreastfeeding: 'Generally compatible when prescribed.',
    },
    allergiesAndAvoid: 'STRICTLY AVOID in anyone allergic to penicillin or cephalosporin antibiotics.',
    warnings: 'Best absorbed 30–60 minutes before food. Finish the full course.',
  },
  {
    id: 'azithromycin',
    generic: 'Azithromycin',
    aliases: ['azithromycin', 'zithromax', 'azithro', 'zimax', 'throat', 'chest'],
    drugClass: 'Macrolide Antibiotic',
    whatItTreats: 'Respiratory tract infections, atypical pneumonia, ear/throat, and certain STI/skin infections.',
    ageGuidance: {
      infantsChildren: 'Pediatric suspension dosed strictly by body weight once daily for 3–5 days.',
      adults: 'Commonly 500mg once daily for 3 days (or per prescription).',
      elderly: 'Caution if heart rhythm (QT prolongation) history or taking cardiac meds.',
      pregnancyBreastfeeding: 'Generally considered low-risk when prescribed; verify first.',
    },
    allergiesAndAvoid: 'Avoid in macrolide allergy (azithromycin, erythromycin, clarithromycin) or history of cholestatic jaundice with azithromycin.',
    warnings: 'Avoid taking at the exact same time as aluminum/magnesium antacids (space by 2 hours).',
  },
  {
    id: 'ciprofloxacin',
    generic: 'Ciprofloxacin',
    aliases: ['ciprofloxacin', 'ciproflaxacin', 'ciprotab', 'cipro', 'typhoid', 'uti', 'urinary', 'stooling'],
    drugClass: 'Fluoroquinolone Antibiotic',
    whatItTreats: 'Urinary tract infections, typhoid/bacterial gastroenteritis, and complicated bacterial infections.',
    ageGuidance: {
      infantsChildren: 'GENERALLY AVOID in children/adolescents under 18 unless specifically ordered by a specialist (tendon/joint cartilage risk).',
      adults: 'Commonly 500mg every 12 hours as prescribed.',
      elderly: 'Higher risk of tendonitis/tendon rupture (especially if taking steroids like prednisolone).',
      pregnancyBreastfeeding: 'AVOID in pregnancy and generally avoid while breastfeeding.',
    },
    allergiesAndAvoid: 'Avoid in children under 18, pregnant women, fluoroquinolone allergy, tendonitis history, or myasthenia gravis.',
    warnings: 'Keep 2 hours apart from dairy, calcium, iron tonics, zinc, and antacids (they block absorption). Stop if Achilles/heel pain starts.',
  },
  {
    id: 'erythromycin',
    generic: 'Erythromycin',
    aliases: ['erythromycin', 'erymed', 'erythro', 'macrolide'],
    drugClass: 'Macrolide Antibiotic',
    whatItTreats: 'Penicillin-alternative option for respiratory, skin, and throat bacterial infections.',
    ageGuidance: {
      infantsChildren: 'Weight-based suspension per prescription; watch newborns under 2 weeks for pyloric stenosis risk.',
      adults: 'Commonly 250mg–500mg every 6 hours.',
      elderly: 'Check interactions (statins, warfarin, blood pressure meds).',
      pregnancyBreastfeeding: 'Erythromycin base/ethylsuccinate often used when needed; avoid estolate salt in pregnancy.',
    },
    allergiesAndAvoid: 'Avoid in macrolide allergy, severe liver disease, or patients on simvastatin/atorvastatin or QT-prolonging heart drugs.',
    warnings: 'Can cause stomach cramps; take with a small snack if needed.',
  },
  {
    id: 'metronidazole',
    generic: 'Metronidazole',
    aliases: ['metronidazole', 'flagyl', 'amoeba', 'diarrhea', 'dysentery', 'dental'],
    drugClass: 'Nitroimidazole Antibiotic / Antiprotozoal',
    whatItTreats: 'Amoebic dysentery, giardia, anaerobic abdominal/dental infections, and bacterial vaginosis.',
    ageGuidance: {
      infantsChildren: 'Weight-based pediatric suspension per doctor/pharmacist prescription.',
      adults: 'Commonly 400mg every 8 hours for 5–7 days.',
      elderly: 'Standard caution in liver disease.',
      pregnancyBreastfeeding: 'Avoid high single doses in first trimester and breastfeeding unless prescribed; ask doctor.',
    },
    allergiesAndAvoid: 'Avoid in metronidazole allergy, active severe liver disease without dose adjustment, and STRICTLY AVOID ALCOHOL.',
    warnings: 'ZERO ALCOHOL during treatment and for 48 hours after finishing (causes severe vomiting, flushing, fast heartbeat).',
  },
  {
    id: 'cefuroxime',
    generic: 'Cefuroxime',
    aliases: ['cefuroxime', 'zinnat', 'cefux', 'axetil'],
    drugClass: '2nd-Generation Cephalosporin Antibiotic',
    whatItTreats: 'Respiratory, urinary, sinus, throat, and skin bacterial infections.',
    ageGuidance: {
      infantsChildren: 'Pediatric suspension dosed by weight with food.',
      adults: 'Commonly 250mg–500mg every 12 hours after a meal.',
      elderly: 'Adjust dose only if severe kidney impairment.',
      pregnancyBreastfeeding: 'Generally regarded as safe when prescribed.',
    },
    allergiesAndAvoid: 'Avoid in cephalosporin allergy or severe anaphylactic penicillin allergy.',
    warnings: 'Absorption improves significantly when taken right after food.',
  },
  {
    id: 'artemether_lumefantrine',
    generic: 'Artemether/Lumefantrine',
    aliases: ['amatem', 'lonart', 'coartem', 'artemether', 'lumefantrine', 'act', 'malaria', 'softgel'],
    drugClass: 'ACT Antimalarial (First-Line Malaria Therapy)',
    whatItTreats: 'Uncomplicated Plasmodium falciparum malaria.',
    ageGuidance: {
      infantsChildren: 'Use child-strength dispersible tablets/syrup strictly by body weight (5–14kg, 15–24kg, 25–34kg).',
      adults: '80/480mg (Amatem Forte by 6) 1 tab twice daily for 3 days, OR 20/120mg (by 24) 4 tabs twice daily for 3 days.',
      elderly: 'Standard adult regimen if >=35 kg; watch heart rhythm drugs.',
      pregnancyBreastfeeding: 'Consult physician/pharmacist — preferred in 2nd/3rd trimester; increasingly accepted in 1st trimester when malaria confirmed, must be doctor-verified.',
    },
    allergiesAndAvoid: 'Avoid in artemether/lumefantrine allergy, severe cardiac QT prolongation, or patients taking drugs that prolong QT/halofantrine.',
    warnings: 'MUST be taken with fatty food or milk (e.g., milk/tea/meal) so lumefantrine absorbs properly! Complete all 6 doses over 3 days.',
  },
  {
    id: 'amodiaquine',
    generic: 'Amodiaquine',
    aliases: ['amodiaquine', 'camoquin', 'artesunate amodiaquine', 'malaria'],
    drugClass: '4-Aminoquinoline Antimalarial',
    whatItTreats: 'Malaria (usually combined with artesunate or sulfadoxine-pyrimethamine).',
    ageGuidance: {
      infantsChildren: 'Pediatric syrup/tablet dosed strictly by child weight.',
      adults: '3-day prescribed course; not for long-term weekly prophylaxis.',
      elderly: 'Check liver function and watch for weakness.',
      pregnancyBreastfeeding: 'Confirm with doctor before use, especially in 1st trimester.',
    },
    allergiesAndAvoid: 'Avoid in amodiaquine allergy, liver disease, retinal/eye disorders, or low white blood cell history.',
    warnings: 'Can cause tiredness, itching, or nausea; stop and seek care if dark urine or yellow eyes appear.',
  },
  {
    id: 'sp_malaria',
    generic: 'Sulfadoxine/Pyrimethamine',
    aliases: ['fansidar', 'amalar', 'maloxine', 'sulfadoxine', 'pyrimethamine', 'sp', 'iptp'],
    drugClass: 'Antimalarial (Sulfa Combination)',
    whatItTreats: 'Intermittent preventive malaria therapy in pregnancy (IPTp) and non-ACT malaria regimens where indicated.',
    ageGuidance: {
      infantsChildren: 'DO NOT give to newborns under 2 months old (kernicterus risk).',
      adults: 'Single 3-tablet dose only when indicated.',
      elderly: 'Monitor hydration and kidney function.',
      pregnancyBreastfeeding: 'Avoid in first trimester and right before delivery; used in 2nd/3rd trimester ANC IPTp under midwife/doctor guidance.',
    },
    allergiesAndAvoid: 'STRICTLY AVOID in SULFA / sulfonamide allergy (can trigger severe Stevens-Johnson rash), G6PD deficiency, severe liver/kidney disease, or newborns <2 months.',
    warnings: 'Stop immediately at the first sign of skin rash or mouth sores.',
  },
  {
    id: 'amlodipine',
    generic: 'Amlodipine',
    aliases: ['amlodipine', 'norvasc', 'berlin', 'teva', 'bp', 'blood pressure', 'hypertension'],
    drugClass: 'Calcium Channel Blocker (Blood Pressure)',
    whatItTreats: 'High blood pressure (hypertension) and chest pain (angina).',
    ageGuidance: {
      infantsChildren: 'Pediatric dosing only under specialist pediatrician care (ages 6+).',
      adults: 'Typically 5mg to 10mg once daily at the same time every day.',
      elderly: 'Often started at 2.5mg–5mg once daily to avoid dizziness/falls.',
      pregnancyBreastfeeding: 'Consult doctor before use in pregnancy (other BP drugs like methyldopa/nifedipine are often preferred).',
    },
    allergiesAndAvoid: 'Avoid in dihydropyridine allergy, dangerously low BP (severe hypotension), cardiogenic shock, or severe aortic stenosis.',
    warnings: 'Maintenance medication — do NOT stop suddenly without doctor review. Common harmless side effect: mild ankle swelling.',
  },
  {
    id: 'lisinopril',
    generic: 'Lisinopril',
    aliases: ['lisinopril', 'zestril', 'bp', 'blood pressure', 'hypertension'],
    drugClass: 'ACE Inhibitor (Blood Pressure / Heart)',
    whatItTreats: 'High blood pressure, heart failure, and diabetic kidney protection.',
    ageGuidance: {
      infantsChildren: 'Specialist pediatric prescription only.',
      adults: 'Once-daily maintenance dosing per prescription.',
      elderly: 'Monitor kidney function and potassium; stand up slowly.',
      pregnancyBreastfeeding: 'STRICTLY CONTRAINDICATED IN PREGNANCY (causes severe fetal kidney/developmental harm).',
    },
    allergiesAndAvoid: 'NEVER use in pregnancy or anyone with previous ACE-inhibitor angioedema (face/lip/tongue swelling) or high blood potassium.',
    warnings: 'If dry persistent cough develops, report to doctor to switch class. Emergency care if lip/tongue swelling occurs.',
  },
  {
    id: 'nifedipine',
    generic: 'Nifedipine',
    aliases: ['nifedipine', 'adalat', 'nifecard', 'bp', 'blood pressure'],
    drugClass: 'Calcium Channel Blocker (Blood Pressure)',
    whatItTreats: 'High blood pressure (extended-release) and angina.',
    ageGuidance: {
      infantsChildren: 'Specialist only.',
      adults: 'Swallow extended-release tablets whole; do NOT crush or chew.',
      elderly: 'Watch for dizziness when standing.',
      pregnancyBreastfeeding: 'Extended-release nifedipine is commonly prescribed in pregnancy hypertension under doctor supervision.',
    },
    allergiesAndAvoid: 'Avoid immediate-release capsules bitten under the tongue for routine BP spikes, severe hypotension, or acute heart attack.',
    warnings: 'Never crush slow-release tablets; causes sudden dangerous BP drop.',
  },
  {
    id: 'metformin',
    generic: 'Metformin',
    aliases: ['metformin', 'biophage', 'glucophage', 'gluformin', 'diabetes', 'sugar'],
    drugClass: 'Biguanide Antidiabetic',
    whatItTreats: 'Type 2 diabetes mellitus (controls blood sugar).',
    ageGuidance: {
      infantsChildren: 'Only under specialist pediatric endocrinology supervision (ages 10+).',
      adults: 'Taken WITH or immediately AFTER meals to reduce stomach upset.',
      elderly: 'Verify kidney function regularly (dose adjustment/stop if severe kidney decline).',
      pregnancyBreastfeeding: 'Used in gestational diabetes ONLY under obstetric/doctor supervision.',
    },
    allergiesAndAvoid: 'Avoid in severe kidney disease (eGFR <30), severe liver failure, diabetic ketoacidosis, severe dehydration/alcoholism, or around contrast CT scans.',
    warnings: 'Always take with food. Do not skip meals or combine with heavy alcohol.',
  },
  {
    id: 'omeprazole',
    generic: 'Omeprazole',
    aliases: ['omeprazole', 'ulcer', 'acipep', 'acid', 'reflux', 'gerd', 'heartburn', 'losec'],
    drugClass: 'Proton Pump Inhibitor (Ulcer / Acid Reducer)',
    whatItTreats: 'Stomach/duodenal ulcers, acid reflux (GERD), heartburn, and NSAID stomach protection.',
    ageGuidance: {
      infantsChildren: 'Weight-adjusted pediatric dosing only by physician.',
      adults: '20mg–40mg ONCE daily 30–60 minutes BEFORE breakfast.',
      elderly: 'Short-term or doctor-reviewed courses (long-term use can lower B12/magnesium).',
      pregnancyBreastfeeding: 'Consult doctor/pharmacist before use.',
    },
    allergiesAndAvoid: 'Avoid in PPI allergy or if taking clopidogrel (reduces clopidogrel effectiveness — prefer pantoprazole).',
    warnings: 'Alarm signs (black tarry stool, vomiting blood, unexplained weight loss, trouble swallowing) require urgent doctor evaluation, not self-treatment.',
  },
  {
    id: 'antacid',
    generic: 'Antacid (Magnesium Trisilicate / Al-Mg Hydroxide)',
    aliases: ['mist mag', 'avrocid', 'gecrol', 'gestid', 'gaviscon', 'antacid', 'heartburn', 'ulcer', 'gas', 'indigestion'],
    drugClass: 'Antacid / Acid Neutralizer',
    whatItTreats: 'Fast temporary relief of heartburn, acid indigestion, bloating, and ulcer pain.',
    ageGuidance: {
      infantsChildren: 'Not routine for babies unless pediatric-prescribed.',
      adults: '10–20ml suspension or 1–2 chewable tablets after meals and at bedtime.',
      elderly: 'Avoid heavy magnesium/aluminum antacids if severe kidney failure.',
      pregnancyBreastfeeding: 'Commonly used short-term for pregnancy heartburn; avoid sodium bicarbonate-heavy products if high BP.',
    },
    allergiesAndAvoid: 'Avoid in severe kidney disease or bowel obstruction.',
    warnings: 'Leave at least 2 hours between antacids and antibiotics (ciprofloxacin, tetracycline) or iron supplements.',
  },
  {
    id: 'loratadine_cetirizine',
    generic: 'Non-Drowsy Antihistamine (Loratadine / Cetirizine)',
    aliases: ['loratadine', 'cetirizine', 'clarityn', 'zyrtec', 'allergy', 'sneezing', 'itching', 'hives', 'catarrh'],
    drugClass: '2nd-Generation Non-Sedating Antihistamine',
    whatItTreats: 'Allergic rhinitis, sneezing, itchy/watery eyes, skin hives, and mild itching without heavy drowsiness.',
    ageGuidance: {
      infantsChildren: 'Pediatric syrup available for ages 2+ (weight/age specific).',
      adults: 'Typically 10mg once daily.',
      elderly: 'Lower dose (5mg cetirizine) if kidney impairment.',
      pregnancyBreastfeeding: 'Loratadine/cetirizine generally preferred when antihistamine needed; confirm first.',
    },
    allergiesAndAvoid: 'Avoid in antihistamine allergy or severe kidney failure (cetirizine needs dose reduction).',
    warnings: 'Cetirizine can still cause mild drowsiness in some people — test before driving.',
  },
  {
    id: 'chlorpheniramine',
    generic: 'Chlorpheniramine (Piriton)',
    aliases: ['piriton', 'chlorpheniramine', 'cpm', 'allergy', 'itching', 'catarrh'],
    drugClass: '1st-Generation Sedating Antihistamine',
    whatItTreats: 'Acute itching, hives, runny nose, sneezing, and allergy reactions.',
    ageGuidance: {
      infantsChildren: 'Avoid OTC in children under 2 years (some regions <6 yrs); strictly use pediatric prescription only.',
      adults: '4mg every 4–6 hours (causes drowsiness).',
      elderly: 'HIGH FALL RISK in elderly (confusion, dizziness, dry mouth, urine retention). Prefer loratadine.',
      pregnancyBreastfeeding: 'Avoid during breastfeeding if possible (can cause infant drowsiness / reduce milk).',
    },
    allergiesAndAvoid: 'Avoid in newborns/premature infants, narrow-angle glaucoma, enlarged prostate/urine retention, or while driving/operating machinery.',
    warnings: 'Causes strong drowsiness; do not combine with alcohol or sleeping pills.',
  },
  {
    id: 'cough_syrup',
    generic: 'Cough & Cold Syrup (Diphenhydramine / Expectorant)',
    aliases: ['emzolyn', 'tuxil', 'benylin', 'cofmix', 'cough', 'cold', 'catarrh', 'phlegm'],
    drugClass: 'Antitussive / Expectorant / Antihistamine Blend',
    whatItTreats: 'Cough, throat irritation, nasal congestion, and chest mucus (dry vs chesty cough formulations differ).',
    ageGuidance: {
      infantsChildren: 'DO NOT give adult cough/cold syrups to children. NEVER give OTC multi-ingredient cough syrups to children under 2–6 years without doctor orders; check child-specific label.',
      adults: 'Measure with dosing cup (not kitchen spoon); sedating blends cause drowsiness.',
      elderly: 'Avoid sedating/decongestant blends if high BP, heart disease, or enlarged prostate.',
      pregnancyBreastfeeding: 'Avoid decongestant (pseudoephedrine/phenylephrine) and codeine cough syrups in pregnancy; ask pharmacist.',
    },
    allergiesAndAvoid: 'Avoid decongestant syrups in uncontrolled hypertension, heart disease, or glaucoma; avoid sedating syrups while driving.',
    warnings: 'Check exact label (Dry vs Chesty vs Adult vs Child). Cough >2 weeks, fever, or blood in sputum needs medical testing.',
  },
  {
    id: 'salbutamol',
    generic: 'Salbutamol',
    aliases: ['salbutamol', 'ventolin', 'asthma', 'inhaler', 'wheezing', 'breathlessness'],
    drugClass: 'Short-Acting Beta-2 Agonist Bronchodilator',
    whatItTreats: 'Asthma flare-ups, wheezing, chest tightness, and shortness of breath.',
    ageGuidance: {
      infantsChildren: 'Inhaler with spacer + mask preferred over oral syrup for children.',
      adults: '1–2 inhaler puffs as needed for wheezing; seek urgent ER care if reliever puffs do not last 4 hours.',
      elderly: 'Monitor fast heartbeat/tremor.',
      pregnancyBreastfeeding: 'Reliever inhalers are generally safe and essential to keep asthma controlled in pregnancy.',
    },
    allergiesAndAvoid: 'Caution in severe uncontrolled heart arrhythmia, severe hyperthyroidism, or low potassium.',
    warnings: 'Can cause temporary shakiness or faster heartbeat. Needing reliever inhaler >2 days/week means asthma needs doctor review for a preventer.',
  },
  {
    id: 'vitamin_c',
    generic: 'Vitamin C (Ascorbic Acid)',
    aliases: ['vitamin c', 'vit c', 'ascorbic', 'emzor vitamin c', 'immune'],
    drugClass: 'Water-Soluble Vitamin Supplement',
    whatItTreats: 'Vitamin C deficiency, immune & wound-healing support, and iron absorption boost.',
    ageGuidance: {
      infantsChildren: 'Child chewables/drops appropriate by age (avoid choking hazard chewables in toddlers).',
      adults: '100mg–500mg daily; high doses (>2,000mg/day) add little benefit and cause diarrhea.',
      elderly: 'Generally safe.',
      pregnancyBreastfeeding: 'Safe at normal nutritional doses; avoid megadoses.',
    },
    allergiesAndAvoid: 'Caution with high doses in kidney stones (oxalate stones) or iron-overload disorders (hemochromatosis).',
    warnings: 'High doses can irritate the stomach or cause loose stools.',
  },
  {
    id: 'b_complex',
    generic: 'Vitamin B-Complex',
    aliases: ['b-complex', 'b complex', 'becombion', 'zetup', 'vitamin b', 'neurobion', 'b12'],
    drugClass: 'B-Vitamin Multivitamin',
    whatItTreats: 'B-vitamin deficiency, energy metabolism, nerve support, appetite/recovery.',
    ageGuidance: {
      infantsChildren: 'Use pediatric B-complex syrup drops/doses by age.',
      adults: '1 tablet daily or 5–10ml syrup as labeled.',
      elderly: 'Beneficial if poor diet or long-term metformin/PPI use.',
      pregnancyBreastfeeding: 'Generally safe at standard dietary supplement doses.',
    },
    allergiesAndAvoid: 'Avoid in rare hypersensitivity to thiamine/cobalt/excipients.',
    warnings: 'Vitamin B2 (riboflavin) harmlessly turns urine bright yellow — reassure customers so they do not worry.',
  },
  {
    id: 'multivitamin',
    generic: 'Multivitamin Drops / Syrup / Capsules',
    aliases: ['abidec', 'astymin', 'wellkid', 'wellwoman', 'multivitamin', 'vitamin', 'drops', 'cipep', 'acipep'],
    drugClass: 'Multivitamin & Amino Acid Supplement',
    whatItTreats: 'Nutritional support during growth, poor appetite, recovery from illness, or fatigue.',
    ageGuidance: {
      infantsChildren: 'Abidec Drops are specifically formulated for infants/toddlers (follow dropper mark strictly — contains Vitamin A & D).',
      adults: '1 capsule/tablet or measured syrup dose once daily after food.',
      elderly: 'Safe; check total Vitamin A/D if taking other supplements.',
      pregnancyBreastfeeding: 'Avoid high-Vitamin-A multivitamins in pregnancy unless it is a dedicated prenatal formula!',
    },
    allergiesAndAvoid: 'Avoid stacking multiple Vitamin A/D or iron-containing multivitamins; check peanut/soy oil carrier allergies on drops/softgels.',
    warnings: 'Never exceed recommended infant drop doses (Vitamin A/D accumulate if overdosed).',
  },
  {
    id: 'cyproheptadine_appetite',
    generic: 'Cyproheptadine / Appetite Syrup',
    aliases: ['cyprivit', 'apetamin', 'avroapetit', 'cyproheptadine', 'appetite', 'weight gain'],
    drugClass: 'Antihistamine / Appetite Stimulant Combination',
    whatItTreats: 'Poor appetite / underweight recovery (often combined with B-vitamins/lysine).',
    ageGuidance: {
      infantsChildren: 'DO NOT give to newborns or children under 2 years. Use pediatric-approved dose only for children 2+ if advised by clinician.',
      adults: 'Causes noticeable drowsiness, especially in the first few days.',
      elderly: 'Avoid in frail elderly (confusion, dry mouth, urine retention, falls).',
      pregnancyBreastfeeding: 'Avoid in breastfeeding (reduces prolactin/milk supply) and check doctor in pregnancy.',
    },
    allergiesAndAvoid: 'Avoid in newborns <2 yrs, breastfeeding mothers, glaucoma, enlarged prostate, stomach outlet obstruction, or driving.',
    warnings: 'Causes strong sleepiness. Never use in place of investigating underlying illness or chronic weight loss.',
  },
  {
    id: 'iron_tonic',
    generic: 'Iron / Blood Tonic',
    aliases: ['liquid iron', 'feroglobin', 'chemiron', 'blood tonic', 'anemia', 'iron', 'folic acid'],
    drugClass: 'Hematinic / Mineral Supplement',
    whatItTreats: 'Iron-deficiency anemia, low blood count, pregnancy iron support, fatigue from low iron.',
    ageGuidance: {
      infantsChildren: 'KEEP OUT OF REACH OF CHILDREN! Accidental iron overdose in toddlers is life-threatening. Use exact dropper/ml only if deficient.',
      adults: 'Best absorbed with Vitamin C; take with light food if nausea occurs.',
      elderly: 'Check cause of anemia with doctor rather than masking GI bleeding.',
      pregnancyBreastfeeding: 'Commonly prescribed in prenatal care; confirm dose with ANC clinic.',
    },
    allergiesAndAvoid: 'Avoid in sickle-cell or thalassemia iron overload unless doctor-confirmed iron deficiency, or active stomach ulcer irritation.',
    warnings: 'Dark/black stools and mild constipation are common harmless effects. Separate from antacids, calcium, dairy, and ciprofloxacin by 2 hours.',
  },
  {
    id: 'cod_liver_oil',
    generic: 'Cod Liver Oil (Omega-3 + Vitamins A & D)',
    aliases: ['codliver', 'cod liver', 'nine seas', 'seven seas', 'fish oil', 'omega'],
    drugClass: 'Marine Oil Supplement (Vitamins A, D & Omega-3)',
    whatItTreats: 'Bone/immune/heart/vision nutritional support.',
    ageGuidance: {
      infantsChildren: 'Use child syrup doses per bottle age chart.',
      adults: '1–2 capsules or 5–10ml daily with meal.',
      elderly: 'Safe; watch if taking blood thinners (warfarin/aspirin) in high doses.',
      pregnancyBreastfeeding: 'AVOID COD LIVER OIL IN PREGNANCY because high Vitamin A (retinol) can harm the unborn baby! Use standard prenatal Omega-3 without Vitamin A instead.',
    },
    allergiesAndAvoid: 'STRICTLY AVOID in fish/shellfish allergy and AVOID in pregnancy due to Vitamin A (retinol) content.',
    warnings: 'Do not combine with other high-dose Vitamin A/D supplements.',
  },
  {
    id: 'antifungal_cream',
    generic: 'Antifungal Cream (Clotrimazole / Ketoconazole / Miconazole)',
    aliases: ['clotrimazole', 'ketoconazole', 'canesten', 'ringworm', 'eczema', 'fungal', 'abf cream'],
    drugClass: 'Topical Antifungal',
    whatItTreats: 'Ringworm, athlete’s foot, jock itch, skin yeast/candida rash.',
    ageGuidance: {
      infantsChildren: 'Safe externally on small localized areas when fungal rash is confirmed.',
      adults: 'Apply a thin layer to clean dry skin twice daily; continue 1–2 weeks after rash clears.',
      elderly: 'Safe externally.',
      pregnancyBreastfeeding: 'Topical clotrimazole is generally considered low-risk externally; avoid nipple application right before breastfeeding.',
    },
    allergiesAndAvoid: 'Avoid if allergic to imidazole antifungals; do not put in eyes or mouth.',
    warnings: 'Keep area dry and clean. For true ringworm, pure antifungal cream works better than steroid-containing creams (which can make ringworm spread!).',
  },
  {
    id: 'triple_action_cream',
    generic: 'Combination Steroid / Antifungal / Antibacterial Cream',
    aliases: ['tribotan', 'skineal', 'funbact', 'epiderm', 'nixoderm', 'betamethasone', 'steroid cream'],
    drugClass: 'Topical Potent Corticosteroid + Antimicrobial Combination',
    whatItTreats: 'Short-term inflamed infected eczema/dermatitis ONLY when prescribed.',
    ageGuidance: {
      infantsChildren: 'Use ONLY child-mild formulas briefly if doctor-prescribed; NEVER use potent adult Tribotan/steroid creams on babies or diaper rash (causes severe skin thinning & adrenal suppression).',
      adults: 'Apply thinly for short term ONLY (5–7 days max); NEVER use on face, groin, or as a skin bleaching cream.',
      elderly: 'Skin is thinner — limit duration carefully.',
      pregnancyBreastfeeding: 'Avoid potent topical steroids over large areas in pregnancy.',
    },
    allergiesAndAvoid: 'Do NOT use on acne, viral skin infections (chickenpox/herpes), open ulcers, baby diaper rash, or as daily facial/bleaching cream.',
    warnings: 'Long-term use causes stretch marks, skin thinning, dark rebound patches, and makes fungal infections worse.',
  },
  {
    id: 'topical_balm',
    generic: 'Topical Analgesic Cream / Balm',
    aliases: ['neurogesic', 'robb', 'aboniki', 'mentholatum', 'methyl salicylate', 'muscle pain', 'balm'],
    drugClass: 'Topical Counterirritant / Analgesic Rub',
    whatItTreats: 'Sore muscles, joint stiffness, backache, mild sprains.',
    ageGuidance: {
      infantsChildren: 'NEVER apply strong methyl-salicylate / camphor / menthol balms near infants’ noses/chests or on young children under 2 (seizure/breathing spasm risk).',
      adults: 'Rub gently on intact skin up to 3–4 times daily; wash hands right after.',
      elderly: 'Do not cover with tight heating pads (causes chemical burns).',
      pregnancyBreastfeeding: 'Avoid large-area methyl salicylate use in late pregnancy.',
    },
    allergiesAndAvoid: 'Avoid in aspirin/salicylate allergy, broken/open skin, eyes, or near infant nostrils.',
    warnings: 'External use ONLY. Do not bandage tightly or apply heat pads over balm.',
  },
  {
    id: 'ors',
    generic: 'Oral Rehydration Salts (ORS)',
    aliases: ['ors', 'oral drip', 'orbs', 'rehydration', 'diarrhea', 'dehydration', 'vomiting'],
    drugClass: 'Electrolyte & Glucose Rehydration Solution',
    whatItTreats: 'Prevents and treats dehydration from diarrhea, vomiting, or heat exhaustion.',
    ageGuidance: {
      infantsChildren: 'FIRST-LINE LIFE-SAVING TREATMENT for childhood diarrhea. Give small frequent sips/spoons after every loose stool.',
      adults: 'Dissolve 1 sachet in the EXACT clean water volume printed on packet (usually 1 litre or 200ml); discard after 24 hours.',
      elderly: 'Excellent hydration support; monitor if severe heart/kidney failure.',
      pregnancyBreastfeeding: 'Completely safe and recommended for diarrhea/vomiting dehydration.',
    },
    allergiesAndAvoid: 'Only avoid oral fluids if unconscious, unable to swallow, or bowel obstruction (seek emergency IV fluids).',
    warnings: 'Never boil ORS after mixing and never mix with milk/juice or wrong water volume. Seek urgent hospital care if sunken eyes, blood in stool, or non-stop vomiting.',
  },
  {
    id: 'albendazole',
    generic: 'Albendazole / Mebendazole (Worm Expeller)',
    aliases: ['albendazole', 'zentel', 'mebendazole', 'worm', 'deworm'],
    drugClass: 'Anthelmintic (Dewormer)',
    whatItTreats: 'Intestinal worm infections (roundworm, hookworm, pinworm, whipworm).',
    ageGuidance: {
      infantsChildren: 'Avoid under 1 year; ages 1–2 years use reduced pediatric dose (e.g. 200mg albendazole) per pharmacist/doctor.',
      adults: 'Usually 400mg single dose (often with a meal).',
      elderly: 'Standard adult dose.',
      pregnancyBreastfeeding: 'AVOID in pregnancy (especially 1st trimester) — confirm before dispensing to women of childbearing age.',
    },
    allergiesAndAvoid: 'STRICTLY AVOID in pregnancy and infants under 1 year.',
    warnings: 'All household members may need hygiene measures or deworming together for pinworm.',
  },
  {
    id: 'klovinal_vaginal',
    generic: 'Metronidazole / Clotrimazole Vaginal Suppository (Klovinal)',
    aliases: ['klovinal', 'clotrimazole pessary', 'vaginal', 'thrush', 'candidiasis'],
    drugClass: 'Combination Antifungal + Antiprotozoal + Antibacterial Pessary',
    whatItTreats: 'Mixed vaginal fungal/bacterial/trichomonal infections (discharge, itching).',
    ageGuidance: {
      infantsChildren: 'NOT FOR CHILDREN.',
      adults: 'Inserted vaginally at bedtime for the full prescribed nights; avoid intercourse during treatment.',
      elderly: 'Suitable if prescribed; check dryness/irritation.',
      pregnancyBreastfeeding: 'Consult doctor/OB first (some combination pessaries containing metronidazole/neomycin are avoided in 1st trimester).',
    },
    allergiesAndAvoid: 'Avoid in pregnancy (especially 1st trimester) without doctor sign-off, children, or allergy to metronidazole/clotrimazole/neomycin.',
    warnings: 'Avoid alcohol while using metronidazole-containing pessaries. Do not swallow — vaginal insertion only.',
  },
];

export const NIGERIA_MARKET_BRANDS = {
  paracetamol: [
    'Panadol (GSK)', 'Emzor Paracetamol (Emzor)', 'M&B Paracetamol (May & Baker)',
    'Panda Paracetamol (Panda)', 'Dana Paracetamol (Dana)', 'Fidson Paracetamol (Fidson)',
    'Boska (Paracetamol/Caffeine)',
  ],
  ibuprofen: [
    'Brufen (Abbott)', 'Brustan-N (Sun Pharma)', 'Ibucap (Emzor)',
    'Emzor Ibuprofen (Emzor)', 'Juhel Ibuprofen (Juhel)',
  ],
  diclofenac: [
    'Cataflam (Novartis)', 'Voltaren (Novartis)', 'Clofenac', 'Emzor Diclofenac (Emzor)', 'Olfen (Mepha)',
  ],
  aspirin: [
    'Anacin', 'Vasoprin (Juhel)', 'Emzor Aspirin (Emzor)', 'Cardiprin',
  ],
  amoxicillin: [
    'Amoxil (GSK)', 'Emoxil (Emzor)', 'Moxipen', 'Tuyil Amoxicillin (Tuyil)',
    'Fidson Amoxicillin (Fidson)', 'Juhel Amoxicillin (Juhel)', 'Bond Amoxicillin',
  ],
  amox_clav: [
    'Augmentin (GSK)', 'Aquaclav', 'Fleming (Medico)', 'Amoksiklav (Sandoz)',
    'Clavam (Alkem)', 'Moxikind-CV (Mankind)',
  ],
  ampiclox: [
    'Ampiclox (GSK)', 'Emzor Ampiclox (Emzor)', 'Fidson Ampiclox (Fidson)',
    'Tuyil Ampiclox (Tuyil)', 'Juhel Ampiclox (Juhel)',
  ],
  azithromycin: [
    'Zithromax (Pfizer)', 'Azithro (Emzor)', 'Zimax', 'Azipro (Fidson)', 'Azee (Cipla)',
  ],
  ciprofloxacin: [
    'Ciprotab (Fidson)', 'Ciprobay (Bayer)', 'Ciprolex', 'Emzor Ciprofloxacin (Emzor)',
    'Juhel Ciprofloxacin (Juhel)', 'Ciprodac',
  ],
  erythromycin: [
    'Erymed (Erymed)', 'Erythrocin', 'Emzor Erythromycin (Emzor)', 'Juhel Erythromycin (Juhel)',
  ],
  metronidazole: [
    'Flagyl (Sanofi)', 'Loxagyl (May & Baker)', 'Emzor Metronidazole (Emzor)', 'Juhel Metronidazole (Juhel)',
  ],
  cefuroxime: [
    'Zinnat (GSK)', 'Cefux', 'Oratil', 'Axacef (Fidson)',
  ],
  artemether_lumefantrine: [
    'Coartem (Novartis)', 'Lonart / Lonart DS (Bliss GVS)', 'Amatem / Amatem Forte (Elbe)',
    'Lumartem (Cipla)', 'Lokmal (Emzor)', 'Combiart (Strides)', 'Coflin', 'Artecom',
  ],
  amodiaquine: [
    'Camoquin (Pfizer)', 'Larimal (Ipca)', 'Camosunate (Geneith)', 'Arsuamoon (Guilin)',
  ],
  sp_malaria: [
    'Fansidar (Roche/Swipha)', 'Amalar (Elbe)', 'Maloxine (Bliss GVS)', 'Swidar (Swipha)',
  ],
  amlodipine: [
    'Norvasc (Pfizer)', 'Amlovas (Macleods)', 'Amlong (Micro Labs)',
    'Berlin Amlodipine (Berlin)', 'Teva Amlodipine (Teva)', 'Amlovar',
    'Emzor Amlodipine (Emzor)', 'Fidson Amlodipine (Fidson)', 'Amlokind',
  ],
  lisinopril: [
    'Zestril (AstraZeneca)', 'Lisopril (Teva)', 'Fidson Lisinopril (Fidson)', 'Emzor Lisinopril (Emzor)',
  ],
  nifedipine: [
    'Adalat LA (Bayer)', 'Nifecard XL', 'Normif (Fidson)', 'Nifedipine Retard (Berlin/Teva)',
  ],
  metformin: [
    'Glucophage (Merck)', 'Biophage (Biophage)', 'Gluformin', 'Diabetmin (Hovid)',
    'Emzor Metformin (Emzor)', 'Fidson Metformin (Fidson)',
  ],
  omeprazole: [
    'Losec (AstraZeneca)', 'Omepraz', 'Acipep', 'Ulcerx', 'Fidson Omeprazole (Fidson)', 'Emzor Omeprazole (Emzor)',
  ],
  antacid: [
    'Gaviscon (Reckitt)', 'Gestid (Ranbaxy/Sun)', 'Mist Mag (Emzor / DM / Tuyil)',
    'Avrocid (Avro)', 'Gecrol', 'Gelusil (Pfizer)', 'Jawasil',
  ],
  loratadine_cetirizine: [
    'Clarityn (Bayer)', 'Zyrtec (UCB)', 'Loratyn (Emzor)', 'Cetzine', 'Cetirizine (Teva / Fidson)',
  ],
  chlorpheniramine: [
    'Piriton (GSK)', 'Emzor Piriton / Chlorpheniramine (Emzor)', 'Juhel Chlorpheniramine (Juhel)',
  ],
  cough_syrup: [
    'Benylin (Johnson & Johnson)', 'Emzolyn (Emzor)', 'Tuxil-N', 'Cofmix (Fidson)', 'Coflin', 'Tutolin',
  ],
  salbutamol: [
    'Ventolin (GSK)', 'Asthalin (Cipla)', 'Salbu', 'Emzor Salbutamol (Emzor)',
  ],
  vitamin_c: [
    'Emzor Vitamin C (Emzor)', 'Jawacare Vitamin C', 'Juhel Vitamin C (Juhel)', 'Ascorbic Acid (M&B / Fidson)',
  ],
  b_complex: [
    'Becombion (Merck/Becombion)', 'Zetup B-Complex (Zetup)', 'Neurobion (P&G/Merck)',
    'Emzor B-Complex (Emzor)', 'B-Vital (Fidson)',
  ],
  multivitamin: [
    'Abidec (Omega Pharma)', 'Astymin (Tablets India)', 'Wellkid / Wellman / Wellwoman (Vitabiotics)',
    'Supradyn (Bayer)', 'Revite', 'Emvite (Emzor)',
  ],
  cyproheptadine_appetite: [
    'Apetamin', 'Cyprivit', 'Avroapetit (Avro)', 'Cypromin', 'Periactin',
  ],
  iron_tonic: [
    'Feroglobin (Vitabiotics)', 'Chemiron', 'Ranferon-12 (Sun Pharma)', 'Astifer (Fidson)', 'Bunto', 'Bioferon',
  ],
  cod_liver_oil: [
    'Seven Seas (Merck/Seven Seas)', 'Nine Seas (Nine Seas)', 'Omega-H3 (Vitabiotics)', 'Maxirich / Carlson',
  ],
  antifungal_cream: [
    'Canesten (Bayer)', 'Clotrimazole (Emzor / Tuyil)', 'Nizoral (Janssen)', 'Fungusol', 'Mycoten',
  ],
  triple_action_cream: [
    'Skineal', 'Funbact-A', 'Tribotan', 'Epiderm', 'Nixoderm', 'Mycoderm',
  ],
  topical_balm: [
    'Neurogesic', 'Robb (PZ Cussons)', 'Aboniki Balm', 'Mentholatum', 'Deep Heat', 'Fastum Gel',
  ],
  ors: [
    'Oral Drip (Orbs)', 'Emzor ORS (Emzor)', 'Drip ORS', 'Fidson ORS (Fidson)', 'WHO Low-Osmolarity ORS',
  ],
  albendazole: [
    'Zentel (GSK)', 'Wormplex', 'Emzor Albendazole (Emzor)', 'Combantrin', 'Nemozole',
  ],
  klovinal_vaginal: [
    'Klovinal', 'Canesten V6 (Bayer)', 'Flagyl / Mycoten Combo Pessary', 'Gyno-Daktarin',
  ],
};

DRUG_REFERENCE.forEach((d) => {
  d.nigeriaMarketBrands = NIGERIA_MARKET_BRANDS[d.id] || [];
});

export function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function money(n) {
  return 'NGN ' + Number(n || 0).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function normalizeText(str) {
  return String(str ?? '')
    .toLowerCase()
    .replace(/[()[\]{}.,/\\\-_+*:;!?'"`~]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a, b) {
  if (a === b) return 0;
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;
  const prev = new Array(bl + 1);
  const curr = new Array(bl + 1);
  for (let j = 0; j <= bl; j++) prev[j] = j;
  for (let i = 1; i <= al; i++) {
    curr[0] = i;
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= bl; j++) prev[j] = curr[j];
  }
  return prev[bl];
}

function tokenSimilarity(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (b.startsWith(a) && a.length >= 3) return 0.92;
  if (b.includes(a) && a.length >= 4) return 0.85;
  if (Math.abs(a.length - b.length) > 3) return 0;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen < 4) return 0;
  const dist = levenshtein(a, b);
  return 1 - dist / maxLen;
}

export function matchDrugReference(medOrQuery) {
  const raw = typeof medOrQuery === 'string'
    ? medOrQuery
    : [medOrQuery?.generic_name, medOrQuery?.name, medOrQuery?.category].filter(Boolean).join(' ');
  const norm = normalizeText(raw);
  if (!norm) return null;

  const tokens = norm.split(' ').filter(t => t.length >= 2);
  let bestRef = null;
  let bestScore = 0;

  for (const ref of DRUG_REFERENCE) {
    let score = 0;
    const gNorm = normalizeText(ref.generic);
    if (norm.includes(gNorm)) score = Math.max(score, 100);
    for (const alias of ref.aliases) {
      const aNorm = normalizeText(alias);
      if (!aNorm) continue;
      if (norm === aNorm) {
        score = Math.max(score, 110);
      } else if (norm.includes(aNorm) && aNorm.length >= 3) {
        score = Math.max(score, 85 + Math.min(15, aNorm.length));
      } else if (aNorm.length >= 4) {
        for (const t of tokens) {
          if (t.length < 4) continue;
          const sim = tokenSimilarity(t, aNorm);
          if (sim >= 0.78) score = Math.max(score, Math.round(sim * 85));
        }
      } else if (tokens.includes(aNorm)) {
        score = Math.max(score, 78);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestRef = ref;
    }
  }
  return bestScore >= 68 ? bestRef : null;
}

function titleCase(str) {
  return String(str ?? '')
    .trim()
    .split(/\s+/)
    .map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '')
    .join(' ');
}

export function inferGenericAndCompany(med) {
  const storedGeneric = med?.generic_name ? String(med.generic_name).trim() : '';
  const storedCompany = med?.company ? String(med.company).trim() : '';
  const ref = matchDrugReference(med || '');
  const generic = storedGeneric || ref?.generic || '';

  if (storedCompany) {
    return { generic, company: storedCompany, ref };
  }

  const name = String(med?.name || '');
  let company = '';

  const parenMatches = [...name.matchAll(/\(([^)]+)\)/g)];
  for (const m of parenMatches) {
    const inside = m[1].trim();
    const low = inside.toLowerCase();
    if (!inside) continue;
    if (/^\d[\d\s\-–]*$/.test(inside)) continue;
    if (/^(or|last|from|about)\s+\d+/i.test(inside)) continue;
    if (/^by\s+\d+$/i.test(inside)) continue;
    if (NON_COMPANY_PARENS.has(low)) continue;
    if (generic && normalizeText(inside) === normalizeText(generic)) {
      const before = name.slice(0, m.index).trim();
      if (before && normalizeText(before) !== normalizeText(generic)) {
        company = titleCase(before);
        break;
      }
      continue;
    }
    company = titleCase(inside);
    break;
  }

  if (!company) {
    const normName = normalizeText(name);
    for (const brand of KNOWN_COMPANIES) {
      const rx = new RegExp(`\\b${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (rx.test(normName)) {
        company = titleCase(brand);
        break;
      }
    }
  }

  return { generic, company, ref };
}

export function fuzzyScore(query, target) {
  const qNorm = normalizeText(query);
  if (!qNorm) return 1;

  const isObj = target && typeof target === 'object';
  const primaryText = isObj ? String(target.name || '') : String(target || '');
  const extraText = isObj
    ? [target.category, target.company, target.generic_name].filter(Boolean).join(' ')
    : '';

  const tNorm = normalizeText(`${primaryText} ${extraText}`);
  if (!tNorm) return 0;

  if (tNorm === qNorm) return 120;
  if (normalizeText(primaryText).startsWith(qNorm)) return 108;
  if (tNorm.includes(qNorm)) return 95;

  const qTokens = qNorm.split(' ').filter(Boolean);
  const tTokens = tNorm.split(' ').filter(Boolean);

  let matchedTokenScore = 0;
  let matchedCount = 0;
  for (const qt of qTokens) {
    let bestTok = 0;
    for (const tt of tTokens) {
      const sim = tokenSimilarity(qt, tt);
      if (sim > bestTok) bestTok = sim;
    }
    if (bestTok >= 0.72) {
      matchedCount += 1;
      matchedTokenScore += bestTok * 90;
    }
  }

  if (matchedCount === qTokens.length && matchedCount > 0) {
    return Math.round(matchedTokenScore / matchedCount);
  }

  const ref = matchDrugReference(target);
  if (ref) {
    const refHaystack = normalizeText([
      ref.generic,
      ref.drugClass,
      ref.whatItTreats,
      ...ref.aliases,
    ].join(' '));
    if (refHaystack.includes(qNorm)) return 82;
    let aliasHits = 0;
    for (const qt of qTokens) {
      if (ref.aliases.some(a => normalizeText(a) === qt || (qt.length >= 4 && tokenSimilarity(qt, normalizeText(a)) >= 0.78))) {
        aliasHits += 1;
      } else if (qt.length >= 4 && refHaystack.includes(qt)) {
        aliasHits += 1;
      }
    }
    if (aliasHits === qTokens.length && aliasHits > 0) return 76;
    if (aliasHits > 0 && qTokens.length > 1) return 52 + aliasHits * 10;
  }

  if (matchedCount > 0 && qTokens.length > 1) {
    return Math.round((matchedTokenScore / qTokens.length) * 0.75);
  }

  return 0;
}

export function findSameDrugBrands(targetMed, allMeds = []) {
  if (!targetMed) return [];
  const targetMeta = inferGenericAndCompany(targetMed);
  if (!targetMeta.generic) {
    const baseToken = normalizeText(targetMed.name).split(' ')[0];
    if (!baseToken || baseToken.length < 4) return [targetMed];
    return allMeds.filter(m => normalizeText(m.name).split(' ')[0] === baseToken);
  }
  const targetGenericNorm = normalizeText(targetMeta.generic);
  return allMeds
    .filter(m => {
      const meta = inferGenericAndCompany(m);
      return meta.generic && normalizeText(meta.generic) === targetGenericNorm;
    })
    .sort((a, b) => {
      if (a.id === targetMed.id) return -1;
      if (b.id === targetMed.id) return 1;
      return String(a.name).localeCompare(String(b.name));
    });
}

export function roundUpToNearest50(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.ceil(n / 50) * 50;
}

export function calculateSellingPriceOptions(unitBuyCost, defaultMarkupPct = 25) {
  const cost = Number(unitBuyCost);
  if (!Number.isFinite(cost) || cost <= 0) {
    return { unitBuyCost: 0, minProfitPrice: 0, options: [] };
  }

  const basePcts = [15, 20, 25, 30];
  const defPct = Number(defaultMarkupPct);
  if (Number.isFinite(defPct) && defPct > 0 && !basePcts.includes(defPct)) {
    basePcts.push(defPct);
    basePcts.sort((a, b) => a - b);
  }

  const minProfitPrice = Math.max(cost + 50, roundUpToNearest50(cost + 1));
  const options = basePcts.map(pct => {
    const raw = cost * (1 + pct / 100);
    let price = roundUpToNearest50(raw);
    if (price <= cost) {
      price = Math.ceil((cost + 1) / 50) * 50;
      if (price <= cost) price = cost + 50;
    }
    return {
      pct,
      raw: Number(raw.toFixed(2)),
      price,
      profit: Number((price - cost).toFixed(2)),
      isDefault: pct === (Number.isFinite(defPct) && defPct > 0 ? defPct : 25),
    };
  });

  return { unitBuyCost: cost, minProfitPrice, options };
}

export function isBelowCost(sellPrice, buyCost) {
  if (sellPrice === null || sellPrice === undefined || sellPrice === '') return false;
  if (buyCost === null || buyCost === undefined || buyCost === '') return false;
  const s = Number(sellPrice);
  const b = Number(buyCost);
  if (!Number.isFinite(s) || !Number.isFinite(b) || b <= 0) return false;
  return s <= b;
}

export function getPrimaryUnitPrice(med) {
  const order = ['card', 'packet', 'bottle', 'tube', 'counting', 'box'];
  for (const qt of order) {
    const p = med?.['price_' + qt];
    if (p !== null && p !== undefined && p !== '' && Number(p) > 0) {
      return { qtyType: qt, unitPrice: Number(p) };
    }
  }
  return null;
}

export function getAllAvailablePrices(med) {
  return UNIT_TYPES
    .map(qt => ({
      qtyType: qt,
      unitPrice: med?.['price_' + qt] !== null && med?.['price_' + qt] !== undefined && med?.['price_' + qt] !== ''
        ? Number(med['price_' + qt])
        : null,
    }))
    .filter(x => x.unitPrice !== null);
}

export function analyzeInventoryVelocity(meds = [], saleItems = [], purchaseEntries = [], now = new Date()) {
  const msDay = 86400000;
  const nowMs = now.getTime();
  const soldByMedId = new Map();
  const soldByName = new Map();

  for (const item of saleItems) {
    const createdMs = item.created_at ? new Date(item.created_at).getTime() : nowMs;
    const daysAgo = (nowMs - createdMs) / msDay;
    const qty = Number(item.quantity || 1);
    const keyId = item.medication_id || null;
    const keyName = normalizeText(item.medication_name || '');

    const bucket = (map, key) => {
      if (!key) return;
      const cur = map.get(key) || { sold7d: 0, sold30d: 0, totalSold: 0, lastSoldAt: null };
      cur.totalSold += qty;
      if (daysAgo <= 7) cur.sold7d += qty;
      if (daysAgo <= 30) cur.sold30d += qty;
      if (!cur.lastSoldAt || createdMs > cur.lastSoldAt) cur.lastSoldAt = createdMs;
      map.set(key, cur);
    };

    if (keyId) bucket(soldByMedId, keyId);
    if (keyName) bucket(soldByName, keyName);
  }

  const latestPurchaseByMed = new Map();
  for (const p of purchaseEntries) {
    if (p.medication_id && !latestPurchaseByMed.has(p.medication_id)) {
      latestPurchaseByMed.set(p.medication_id, p);
    }
  }

  const companyMap = new Map();
  const analyzed = meds.map(m => {
    const meta = inferGenericAndCompany(m);
    const salesStats = soldByMedId.get(m.id) || soldByName.get(normalizeText(m.name)) || {
      sold7d: 0, sold30d: 0, totalSold: 0, lastSoldAt: null,
    };
    const availablePrices = getAllAvailablePrices(m);
    const missingPrice = availablePrices.length === 0;
    const tracked = m.stock_qty !== null && m.stock_qty !== undefined;
    const stockQty = tracked ? Number(m.stock_qty) : null;
    const reorderLevel = Number(m.reorder_level ?? 5);
    const latestPurchase = latestPurchaseByMed.get(m.id);
    const lastBuyUnitPrice = m.last_buy_unit_price !== null && m.last_buy_unit_price !== undefined
      ? Number(m.last_buy_unit_price)
      : (latestPurchase ? Number(latestPurchase.unit_buy_price) : null);

    const isFastMover = salesStats.sold7d >= 5 || salesStats.sold30d >= 12;
    const isLowOrOut = tracked && stockQty <= reorderLevel;
    const isOut = tracked && stockQty === 0;
    const isRestockNow = isOut || (isLowOrOut && (salesStats.sold7d > 0 || salesStats.sold30d > 0 || stockQty <= Math.max(2, Math.floor(reorderLevel / 2))));
    const daysSinceBought = m.last_bought_at ? (nowMs - new Date(m.last_bought_at).getTime()) / msDay : null;
    const isSlowMover = salesStats.sold30d === 0 && (
      (tracked && stockQty >= Math.max(reorderLevel * 2, 10)) ||
      (daysSinceBought !== null && daysSinceBought >= 30)
    );

    const suggestedOrderQty = isRestockNow || isLowOrOut
      ? Math.max(reorderLevel * 2 - (stockQty ?? 0), Math.ceil(salesStats.sold30d * 0.5), 5)
      : 0;

    let status = 'untracked';
    if (isRestockNow) status = 'restock_now';
    else if (isLowOrOut) status = 'low_stock';
    else if (isSlowMover) status = 'slow_mover';
    else if (isFastMover) status = 'fast_mover';
    else if (tracked) status = 'healthy';

    const compLabel = meta.company || 'Unassigned / House Brand';
    if (!companyMap.has(compLabel)) companyMap.set(compLabel, []);
    companyMap.get(compLabel).push({ ...m, meta, availablePrices });

    return {
      med: m,
      meta,
      availablePrices,
      missingPrice,
      tracked,
      stockQty,
      reorderLevel,
      lastBuyUnitPrice,
      lastBuyPackLabel: m.last_buy_pack_label || latestPurchase?.pack_description || null,
      sold7d: salesStats.sold7d,
      sold30d: salesStats.sold30d,
      totalSold: salesStats.totalSold,
      lastSoldAt: salesStats.lastSoldAt,
      isFastMover,
      isLowOrOut,
      isOut,
      isRestockNow,
      isSlowMover,
      suggestedOrderQty,
      estimatedOrderCost: lastBuyUnitPrice ? suggestedOrderQty * lastBuyUnitPrice : null,
      status,
    };
  });

  const restockNow = analyzed.filter(x => x.isRestockNow).sort((a, b) => (a.stockQty ?? 999) - (b.stockQty ?? 999) || b.sold7d - a.sold7d);
  const lowStock = analyzed.filter(x => x.isLowOrOut && !x.isRestockNow);
  const fastMovers = analyzed.filter(x => x.isFastMover).sort((a, b) => b.sold7d - a.sold7d || b.sold30d - a.sold30d);
  const slowMovers = analyzed.filter(x => x.isSlowMover).sort((a, b) => (b.stockQty ?? 0) - (a.stockQty ?? 0));
  const missingPrice = analyzed.filter(x => x.missingPrice);
  const trackedCount = analyzed.filter(x => x.tracked).length;

  const urgentItems = [...restockNow, ...lowStock];
  const totalEstimatedSpend = urgentItems.reduce((sum, x) => sum + (x.estimatedOrderCost || 0), 0);
  const restockLines = urgentItems.map(x => {
    const costNote = x.lastBuyUnitPrice ? ` (last buy: ${money(x.lastBuyUnitPrice)}, est: ${money(x.estimatedOrderCost)})` : '';
    const compNote = x.meta.company ? ` [${x.meta.company}]` : '';
    return `- ${x.med.name}${compNote}: have ${x.stockQty} ${x.med.stock_unit || 'unit'}, order ~${x.suggestedOrderQty}${costNote}`;
  });
  const restockListText = urgentItems.length > 0
    ? `PHARMACY RESTOCK LIST (${now.toLocaleDateString()})\n${restockLines.join('\n')}${totalEstimatedSpend > 0 ? `\nEstimated Total: ${money(totalEstimatedSpend)}` : ''}`
    : `PHARMACY RESTOCK LIST (${now.toLocaleDateString()})\nNo tracked items are currently below reorder level. Log stock counts or purchases to track reorder alerts.`;

  const companyGroups = [...companyMap.entries()]
    .map(([company, items]) => ({ company, count: items.length, items }))
    .sort((a, b) => {
      if (a.company === 'Unassigned / House Brand') return 1;
      if (b.company === 'Unassigned / House Brand') return -1;
      return b.count - a.count || a.company.localeCompare(b.company);
    });

  return {
    items: analyzed,
    restockNow,
    lowStock,
    fastMovers,
    slowMovers,
    missingPrice,
    trackedCount,
    urgentItems,
    totalEstimatedSpend,
    restockListText,
    companyGroups,
  };
}

const WORD_NUMS = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};

const UNIT_ALIASES = {
  packet: 'packet', packets: 'packet', pack: 'packet', packs: 'packet', pkt: 'packet', pkts: 'packet',
  box: 'box', boxes: 'box', carton: 'box', cartons: 'box',
  card: 'card', cards: 'card', strip: 'card', strips: 'card', sachet: 'card', sachets: 'card',
  bottle: 'bottle', bottles: 'bottle', btl: 'bottle', btls: 'bottle', syrup: 'bottle',
  tube: 'tube', tubes: 'tube',
  counting: 'counting', count: 'counting', tab: 'counting', tabs: 'counting', tablet: 'counting',
  tablets: 'counting', cap: 'counting', caps: 'counting', capsule: 'counting', capsules: 'counting', single: 'counting',
};

export function parseBasketQuery(query, meds = []) {
  const raw = String(query || '')
    .replace(/^(price check|calculate|calc|quote|total|ring up|sell|add|cost of|how much is|how much for)\s*:?\s*/i, '')
    .trim();

  if (!raw) return { items: [], total: 0, unmatched: [] };

  const segments = raw
    .split(/,|;|\n|\s+\band\b\s+|\s*\+\s*|\s*&\s*/i)
    .map(s => s.trim())
    .filter(Boolean);

  const items = [];
  const unmatched = [];

  for (const seg of segments) {
    let text = seg.trim();
    let quantity = 1;
    let requestedUnit = null;

    const qtyMatch = text.match(/^(\d+|one|two|three|four|five|six|seven|eight|nine|ten|a|an)\b\s*/i);
    if (qtyMatch) {
      const qWord = qtyMatch[1].toLowerCase();
      quantity = WORD_NUMS[qWord] ?? Math.max(1, Number(qWord));
      text = text.slice(qtyMatch[0].length).trim();
    }

    const unitMatch = text.match(/^([a-zA-Z]+)\s+(?:of\s+)?/i);
    if (unitMatch && UNIT_ALIASES[unitMatch[1].toLowerCase()]) {
      requestedUnit = UNIT_ALIASES[unitMatch[1].toLowerCase()];
      text = text.slice(unitMatch[0].length).trim();
    } else {
      const tailUnit = text.match(/\b(packets?|packs?|pkts?|boxes?|cards?|strips?|bottles?|btls?|tubes?|counting|tablets?|tabs?|capsules?|caps?)\b/i);
      if (tailUnit && UNIT_ALIASES[tailUnit[1].toLowerCase()]) {
        requestedUnit = UNIT_ALIASES[tailUnit[1].toLowerCase()];
        text = text.replace(tailUnit[0], ' ').replace(/\s+/g, ' ').trim();
      }
    }

    text = text.replace(/^(of|the)\s+/i, '').trim();
    if (!text) {
      unmatched.push(seg);
      continue;
    }

    let bestMed = null;
    let bestScore = 0;
    for (const m of meds) {
      const s = fuzzyScore(text, m);
      if (s > bestScore) {
        bestScore = s;
        bestMed = m;
      }
    }

    if (!bestMed || bestScore < 60) {
      unmatched.push(seg);
      continue;
    }

    let unitType = requestedUnit;
    let unitPrice = unitType && bestMed['price_' + unitType] != null ? Number(bestMed['price_' + unitType]) : null;
    let fallbackUsed = false;

    if (unitPrice === null || !Number.isFinite(unitPrice)) {
      const primary = getPrimaryUnitPrice(bestMed);
      if (primary) {
        unitType = primary.qtyType;
        unitPrice = primary.unitPrice;
        fallbackUsed = Boolean(requestedUnit);
      }
    }

    if (unitPrice === null) {
      unmatched.push(`${bestMed.name} (no price set yet)`);
      continue;
    }

    items.push({
      medication_id: bestMed.id,
      name: bestMed.name,
      qty_type: unitType,
      requestedUnit,
      fallbackUsed,
      unit_price: unitPrice,
      quantity,
      subtotal: unitPrice * quantity,
      med: bestMed,
    });
  }

  const total = items.reduce((sum, i) => sum + i.subtotal, 0);
  return { items, total, unmatched };
}

function findMatchingMeds(question, meds = [], limit = 6) {
  const cleaned = normalizeText(question)
    .replace(/\b(what|which|who|should|not|take|can|children|child|baby|pregnant|pregnancy|elderly|allergy|allergies|company|companies|brands?|shelf|have|stock|restock|buy|bought|purchase|price|sell|for|how|much|cost|about|tell|me|info|information|do|we|of|the|a|an|is|are|and|or|to|in|on|with)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const searchSeed = cleaned || normalizeText(question);
  if (!searchSeed) return [];

  return meds
    .map(m => ({ med: m, score: fuzzyScore(searchSeed, m) }))
    .filter(x => x.score >= 60)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.med);
}

export function runLocalAssistant({
  question,
  modeHint = null,
  medication = null,
  meds = [],
  purchaseEntries = [],
  saleItems = [],
}) {
  const q = String(question || '').trim();
  const qLow = q.toLowerCase();
  const actions = [];
  const sections = [];

  // 1. Purchase cost / markup math query (e.g. "bought a roll of 10 for 8500 what should I sell 1 for?")
  const rollOfMatch = q.match(/(?:roll|box|pack|carton|bundle|case|crate)\s+of\s+(\d+(?:\.\d+)?)\s*(?:units?|packets?|packs?|tins?|cards?|bottles?|tubes?|pieces?|pcs?)?\s*(?:for|at|cost|paid|=)?\s*(?:ngn|₦)?\s*([\d,]+(?:\.\d+)?)/i);
  const packPriceMatch = rollOfMatch
    || q.match(/(\d+(?:\.\d+)?)\s*(?:units?|packets?|packs?|tins?|cards?|bottles?|tubes?|boxes?|pieces?|pcs?)\s*(?:for|at|cost|paid|=)\s*(?:ngn|₦)?\s*([\d,]+(?:\.\d+)?)/i)
    || q.match(/(\d+(?:\.\d+)?)\s*(?:for|at|cost|paid)\s*(?:ngn|₦)?\s*([\d,]{3,}(?:\.\d+)?)/i);

  if (modeHint === 'pricing' || packPriceMatch || /\b(what should i sell|selling price|markup|profit|cost price|purchase book|bought|uncle paid)\b/i.test(qLow)) {
    const matchedMeds = medication ? [medication] : findMatchingMeds(q, meds, 4);

    let units = null;
    let total = null;
    if (packPriceMatch) {
      units = Number(String(packPriceMatch[1]).replace(/,/g, ''));
      total = Number(String(packPriceMatch[2]).replace(/,/g, ''));
    } else {
      const cleanedForNums = q.replace(/\bsell\s+\d+(?:\.\d+)?\b/gi, '').replace(/,/g, '');
      const nums = [...cleanedForNums.matchAll(/\b\d+(?:\.\d+)?\b/g)].map(m => Number(m[0]));
      if (nums.length >= 2) {
        total = Math.max(...nums);
        const nonTotal = nums.filter(n => n !== total);
        units = nonTotal[nonTotal.length - 1] ?? nums[0];
      }
    }

    if (units > 0 && total > 0) {
      const unitCost = total / units;
      const calc = calculateSellingPriceOptions(unitCost, 25);

      sections.push({
        heading: 'Purchase Cost Breakdown',
        body: `${units} units for ${money(total)} = ${money(unitCost)} per single unit.`,
      });
      sections.push({
        heading: 'Recommended Retail Prices (Never Sell at or Below Cost)',
        body: calc.options.map(o => `+${o.pct}% markup: ${money(o.price)} (profit ${money(o.profit)}/unit)`).join('\n'),
      });

      return {
        mode: 'local',
        title: 'Purchase Cost & Selling Price Advice',
        answer: `Single unit buy cost is ${money(unitCost)}. Do NOT sell at or below ${money(unitCost)}. Suggested selling prices: ${calc.options.map(o => `+${o.pct}% → ${money(o.price)}`).join(' · ')}.`,
        sections,
        actions,
        matchedMeds,
        disclaimer: DISCLAIMER,
      };
    }

    if (matchedMeds.length > 0) {
      const lines = [];
      for (const m of matchedMeds) {
        const latest = purchaseEntries.find(p => p.medication_id === m.id);
        const buyCost = m.last_buy_unit_price ?? latest?.unit_buy_price ?? null;
        if (buyCost != null && Number(buyCost) > 0) {
          const calc = calculateSellingPriceOptions(buyCost, m.default_markup_pct ?? 25);
          const curPrices = getAllAvailablePrices(m).map(p => `${p.qtyType}: ${money(p.unitPrice)}`).join(', ') || 'None set';
          lines.push(`${m.name}: Last bought at ${money(buyCost)} (${m.last_buy_pack_label || latest?.pack_description || '1 unit'}). Current retail: ${curPrices}. Safe +25% sell: ${money(calc.options.find(o => o.pct === 25)?.price || calc.minProfitPrice)}.`);
          actions.push({ type: 'open_purchase_book', label: `Log purchase for ${m.name}`, medicationId: m.id });
          actions.push({ type: 'prefill_suggestion', label: `Suggest price for ${m.name}`, medicationId: m.id, suggestedPrice: calc.options.find(o => o.pct === 25)?.price });
        } else {
          lines.push(`${m.name}: No purchase book cost logged yet. Log Uncle's pack rate in Purchase Book to get instant markup guidance.`);
          actions.push({ type: 'open_purchase_book', label: `Log buy price for ${m.name}`, medicationId: m.id });
        }
      }
      return {
        mode: 'local',
        title: 'Purchase Book & Retail Price Advice',
        answer: lines.join('\n\n'),
        sections,
        actions,
        matchedMeds,
        disclaimer: DISCLAIMER,
      };
    }
  }

  // 2. Restock & Slow-Movers Query
  if (modeHint === 'restock' || /\b(restock|reorder|low stock|out of stock|slow mover|slow-mover|overbuy|fast mover|selling fast)\b/i.test(qLow)) {
    const vel = analyzeInventoryVelocity(meds, saleItems, purchaseEntries);
    const lines = [];
    if (vel.urgentItems.length > 0) {
      lines.push(`Need Restock (${vel.urgentItems.length}): ` + vel.urgentItems.slice(0, 6).map(x => `${x.med.name} (have ${x.stockQty}, order ~${x.suggestedOrderQty})`).join('; '));
    } else {
      lines.push(`Tracked Stock Status: ${vel.trackedCount} of ${meds.length} items currently have stock counts entered; none are below reorder level right now.`);
    }
    if (vel.fastMovers.length > 0) {
      lines.push(`Fast Movers (7d/30d): ` + vel.fastMovers.slice(0, 5).map(x => `${x.med.name} (${x.sold7d}/7d, ${x.sold30d}/30d)`).join('; '));
    }
    if (vel.slowMovers.length > 0) {
      lines.push(`Slow Movers — Don't Overbuy (${vel.slowMovers.length}): ` + vel.slowMovers.slice(0, 5).map(x => `${x.med.name} (0 sold in 30d, have ${x.stockQty})`).join('; '));
    }
    if (vel.missingPrice.length > 0) {
      lines.push(`Missing Selling Prices: ${vel.missingPrice.length} items have no selling price set yet.`);
    }
    actions.push({ type: 'open_tab', tab: 'restock', label: 'Open Restock Planner' });

    return {
      mode: 'local',
      title: 'Restock & Slow-Mover Summary',
      answer: lines.join('\n\n'),
      sections,
      actions,
      matchedMeds: vel.urgentItems.slice(0, 4).map(x => x.med),
      disclaimer: DISCLAIMER,
    };
  }

  // 3. Company / Brand Comparison & Nigerian Market Circulation Query
  if (modeHint === 'brands' || /\b(compan|brand|manufacturer|which .* do we have|circulat|nigeria|don't have|dont have|not on.*shelf|same drug|alternative|substitute|berlin|teva)\b/i.test(qLow)) {
    const matchedMeds = medication ? [medication] : findMatchingMeds(q, meds, 6);
    const directRef = medication ? matchDrugReference(medication) : matchDrugReference(q);
    const ref = directRef || (matchedMeds[0] ? matchDrugReference(matchedMeds[0]) : null);

    if (matchedMeds.length > 0 || ref) {
      const brands = matchedMeds.length > 0 ? findSameDrugBrands(matchedMeds[0], meds) : [];
      const targetMeta = matchedMeds[0] ? inferGenericAndCompany(matchedMeds[0]) : { generic: ref?.generic || '' };
      const topicName = targetMeta.generic || ref?.generic || matchedMeds[0]?.name || q;

      const shelfLines = brands.map(b => {
        const bm = inferGenericAndCompany(b);
        const prices = getAllAvailablePrices(b).map(p => `${p.qtyType} ${money(p.unitPrice)}`).join(', ') || 'No price set';
        const stockLabel = b.stock_qty != null ? `Stock: ${b.stock_qty}` : 'Stock untracked';
        return `* **${b.name}** — Company: ${bm.company || 'Unlabeled'} · ${prices} · ${stockLabel}`;
      });

      const shelfTextNorm = normalizeText(brands.map(b => `${b.name} ${inferGenericAndCompany(b).company}`).join(' '));
      const marketBrands = (ref?.nigeriaMarketBrands || []).filter(mb => {
        const mbTokens = normalizeText(mb).split(' ').filter(t => t.length >= 4);
        return !mbTokens.some(t => shelfTextNorm.includes(t) && !normalizeText(topicName).includes(t));
      });

      if (brands.length > 0) {
        actions.push({ type: 'compare_brands', medicationId: matchedMeds[0].id, label: `Compare ${brands.length} on shelf` });
      }

      const answerParts = [];
      answerParts.push(`### Currently on Your Shelf`);
      if (shelfLines.length > 0) {
        answerParts.push(shelfLines.join('\n'));
      } else {
        answerParts.push(`* No ${topicName} products matched directly on your current shelf list.`);
      }

      if (marketBrands.length > 0) {
        answerParts.push(`### Other Popular Brands Circulating in Nigeria (Not on Your Shelf)\n` +
          marketBrands.map(b => `* ${b}`).join('\n') +
          `\n* Always verify a valid **NAFDAC Reg. No.** and purchase from licensed wholesale distributors.`);
      }

      return {
        mode: 'local',
        title: `Companies & Nigerian Market — ${topicName}`,
        answer: answerParts.join('\n\n'),
        sections,
        actions,
        matchedMeds: brands,
        disclaimer: DISCLAIMER,
      };
    }
  }

  // 4. Multi-Item Basket / Quick Quote Query
  const looksLikeBasket = /\d+\s*(cards?|packets?|packs?|boxes?|bottles?|tubes?|tablets?|tabs?)/i.test(q) || /\band\b/i.test(qLow) && /,|\d/.test(q);
  if (modeHint === 'basket' || looksLikeBasket) {
    const parsed = parseBasketQuery(q, meds);
    if (parsed.items.length > 0 && (parsed.items.length > 1 || /\b(price|cost|total|ring|sell|add|quote|calculate)\b|\d+/.test(qLow))) {
      const lines = parsed.items.map(i =>
        `• ${i.quantity} × ${i.name} (${i.qty_type}${i.fallbackUsed ? ' — requested unit not priced, used primary' : ''}) @ ${money(i.unit_price)} = ${money(i.subtotal)}`
      );
      if (parsed.unmatched.length > 0) {
        lines.push(`Unmatched: ${parsed.unmatched.join(', ')}`);
      }
      actions.push({
        type: 'add_all_to_cart',
        label: `Add all (${money(parsed.total)}) to Sale`,
        items: parsed.items.map(i => ({
          medication_id: i.medication_id,
          name: i.name,
          qty_type: i.qty_type,
          unit_price: i.unit_price,
          quantity: i.quantity,
        })),
      });

      return {
        mode: 'local',
        title: `Counter Quote — ${money(parsed.total)}`,
        answer: `${lines.join('\n')}\n\nTotal: ${money(parsed.total)}`,
        sections,
        actions,
        matchedMeds: parsed.items.map(i => i.med),
        disclaimer: DISCLAIMER,
      };
    }
  }

  // 5. Clinical / Age / Allergy / Contraindication Reference + Catalog Match
  const matchedMeds = medication ? [medication] : findMatchingMeds(q, meds, 6);
  const directRef = medication ? matchDrugReference(medication) : matchDrugReference(q);
  const ref = directRef || (matchedMeds[0] ? matchDrugReference(matchedMeds[0]) : null);

  if (ref) {
    sections.push({ heading: 'Drug Class & Uses', body: `${ref.drugClass}\n${ref.whatItTreats}` });
    sections.push({
      heading: 'Age-Group Guidance',
      body:
        `• Infants & Children: ${ref.ageGuidance.infantsChildren}\n` +
        `• Adults: ${ref.ageGuidance.adults}\n` +
        `• Elderly: ${ref.ageGuidance.elderly}\n` +
        `• Pregnancy & Breastfeeding: ${ref.ageGuidance.pregnancyBreastfeeding}`,
    });
    sections.push({ heading: 'Allergies & Who Should NOT Take It', body: ref.allergiesAndAvoid });
    sections.push({ heading: 'Key Safety Warnings', body: ref.warnings });

    if (matchedMeds.length > 0) {
      const shelfSummary = matchedMeds.map(m => {
        const meta = inferGenericAndCompany(m);
        const prices = getAllAvailablePrices(m).map(p => `${p.qtyType} ${money(p.unitPrice)}`).join(', ') || 'No price set';
        return `• ${m.name}${meta.company ? ` (${meta.company})` : ''}: ${prices}`;
      }).join('\n');
      sections.push({ heading: 'On Your Shelf Right Now', body: shelfSummary });

      const firstPrimary = getPrimaryUnitPrice(matchedMeds[0]);
      if (firstPrimary) {
        actions.push({
          type: 'add_all_to_cart',
          label: `Add 1 ${matchedMeds[0].name} (${firstPrimary.qtyType} · ${money(firstPrimary.unitPrice)})`,
          items: [{
            medication_id: matchedMeds[0].id,
            name: matchedMeds[0].name,
            qty_type: firstPrimary.qtyType,
            unit_price: firstPrimary.unitPrice,
            quantity: 1,
          }],
        });
      }
      const brands = findSameDrugBrands(matchedMeds[0], meds);
      if (brands.length > 1) {
        actions.push({
          type: 'compare_brands',
          medicationId: matchedMeds[0].id,
          label: `Compare ${brands.length} companies on shelf`,
        });
      }
    }

    return {
      mode: 'local',
      title: `${ref.generic} — Medication & Safety Guide`,
      answer: `${ref.drugClass}: ${ref.whatItTreats}\n\nAllergies & Avoid: ${ref.allergiesAndAvoid}`,
      sections,
      actions,
      matchedMeds,
      disclaimer: DISCLAIMER,
    };
  }

  // 6. General Catalog Fallback
  if (matchedMeds.length > 0) {
    const lines = matchedMeds.map(m => {
      const meta = inferGenericAndCompany(m);
      const prices = getAllAvailablePrices(m).map(p => `${p.qtyType}: ${money(p.unitPrice)}`).join(' · ') || 'No selling price set yet';
      return `• ${m.name} (${m.category}${meta.company ? ` · ${meta.company}` : ''}) — ${prices}`;
    });
    const firstPrimary = getPrimaryUnitPrice(matchedMeds[0]);
    if (firstPrimary) {
      actions.push({
        type: 'add_all_to_cart',
        label: `Add 1 ${matchedMeds[0].name} (${money(firstPrimary.unitPrice)})`,
        items: [{
          medication_id: matchedMeds[0].id,
          name: matchedMeds[0].name,
          qty_type: firstPrimary.qtyType,
          unit_price: firstPrimary.unitPrice,
          quantity: 1,
        }],
      });
    }
    return {
      mode: 'local',
      title: 'Shelf Price Lookup',
      answer: `Found ${matchedMeds.length} matching shelf item(s):\n${lines.join('\n')}`,
      sections,
      actions,
      matchedMeds,
      disclaimer: DISCLAIMER,
    };
  }

  return {
    mode: 'local',
    title: 'No Exact Match Found',
    answer:
      `I couldn't find a direct shelf or reference match for "${q}". Try:\n` +
      `• Typing a medicine or active ingredient (e.g. "Amoxil", "Amlodipine", "Amatem", "Ciprofloxacin")\n` +
      `• Asking a price calculation ("2 cards Amoxil 500 and 1 bottle Abidec")\n` +
      `• Asking about purchase pricing ("bought 1 roll of 10 for 8500 what should I sell 1 for?")\n` +
      `• Checking companies ("What companies of Amlodipine do we have?") or Restock status.`,
    sections,
    actions: [{ type: 'open_tab', tab: 'sell', label: 'Browse Full Price List' }],
    matchedMeds: [],
    disclaimer: DISCLAIMER,
  };
}

export async function askPharmacyAI({
  supabase,
  question,
  history = [],
  modeHint = null,
  medication = null,
  meds = [],
  purchaseEntries = [],
  saleItems = [],
}) {
  const localResult = runLocalAssistant({
    question,
    modeHint,
    medication,
    meds,
    purchaseEntries,
    saleItems,
  });

  if (!supabase?.functions?.invoke) {
    return { ...localResult, geminiConfigured: false };
  }

  const contextMeds = (localResult.matchedMeds?.length ? localResult.matchedMeds : findMatchingMeds(question, meds, 10))
    .slice(0, 12)
    .map(m => {
      const meta = inferGenericAndCompany(m);
      return {
        name: m.name,
        category: m.category,
        company: meta.company || null,
        generic: meta.generic || null,
        stock_qty: m.stock_qty,
        reorder_level: m.reorder_level,
        last_buy_unit_price: m.last_buy_unit_price,
        last_buy_pack_label: m.last_buy_pack_label,
        prices: getAllAvailablePrices(m),
      };
    });

  const fullCatalogSummary = meds
    .map(m => {
      const meta = inferGenericAndCompany(m);
      const prices = getAllAvailablePrices(m).map(p => `${p.qtyType}:${p.unitPrice}`).join(',') || 'unpriced';
      const parts = [m.name, m.category];
      if (meta.company) parts.push(`Co:${meta.company}`);
      if (meta.generic) parts.push(`Gen:${meta.generic}`);
      parts.push(prices);
      if (m.last_buy_unit_price != null) parts.push(`buy:${m.last_buy_unit_price}`);
      if (m.stock_qty != null) parts.push(`stk:${m.stock_qty}`);
      return parts.join(' | ');
    })
    .join('\n');

  const medIds = new Set((localResult.matchedMeds || []).map(m => m.id));
  const purchaseContext = purchaseEntries
    .filter(p => medIds.has(p.medication_id) || fuzzyScore(question, p.medication_name) >= 65)
    .slice(0, 8)
    .map(p => ({
      medication_name: p.medication_name,
      company: p.company,
      pack_description: p.pack_description,
      quantity_units: p.quantity_units,
      unit_type: p.unit_type,
      unit_buy_price: p.unit_buy_price,
      total_cost: p.total_cost,
      purchased_at: p.purchased_at,
    }));

  const vel = analyzeInventoryVelocity(meds, saleItems, purchaseEntries);
  const restockContext = {
    urgentRestock: vel.urgentItems.slice(0, 8).map(x => ({
      name: x.med.name,
      stock_qty: x.stockQty,
      reorder_level: x.reorderLevel,
      sold7d: x.sold7d,
      sold30d: x.sold30d,
      last_buy_unit_price: x.lastBuyUnitPrice,
    })),
    slowMovers: vel.slowMovers.slice(0, 6).map(x => ({
      name: x.med.name,
      stock_qty: x.stockQty,
      sold30d: x.sold30d,
    })),
  };

  try {
    const { data, error } = await supabase.functions.invoke('pharmacy-ai', {
      body: {
        question,
        history: (history || []).slice(-6),
        modeHint,
        medication: medication ? {
          name: medication.name,
          category: medication.category,
          ...inferGenericAndCompany(medication),
          last_buy_unit_price: medication.last_buy_unit_price,
          prices: getAllAvailablePrices(medication),
        } : null,
        catalogContext: contextMeds,
        fullCatalogSummary,
        purchaseContext,
        restockContext,
      },
    });

    if (!error && data?.configured === true && data?.mode === 'gemini' && data?.answer) {
      return {
        ...localResult,
        mode: 'gemini',
        model: data.model || null,
        geminiConfigured: true,
        answer: data.answer,
        sections: [],
        disclaimer: data.disclaimer || DISCLAIMER,
      };
    }

    return {
      ...localResult,
      mode: 'local',
      geminiConfigured: Boolean(data?.configured),
      statusNote: data?.message || '',
    };
  } catch {
    return {
      ...localResult,
      mode: 'local',
      geminiConfigured: false,
    };
  }
}

function formatInlineMarkdown(escapedLine) {
  return escapedLine
    .replace(/`([^`]+)`/g, '<code class="font-mono text-xs bg-black/5 px-1 py-0.5 rounded">$1</code>')
    .replace(/\*\*([^*]+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/__([^_]+?)__/g, '<strong class="font-semibold">$1</strong>')
    .replace(/(^|[\s(>])\*([^*\s][^*]*?)\*(?=[\s.,;:!?)]|$)/g, '$1<em>$2</em>')
    .replace(/\*/g, '');
}

export function formatAiMarkdownHtml(rawText) {
  const safeLines = esc(String(rawText ?? '').replace(/\r\n?/g, '\n')).split('\n');
  const out = [];
  let openList = null;

  const closeList = () => {
    if (openList === 'ul') out.push('</ul>');
    else if (openList === 'ol') out.push('</ol>');
    openList = null;
  };

  for (const line of safeLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      continue;
    }

    if (/^(?:[-*_]\s*){3,}$/.test(trimmed)) {
      closeList();
      out.push('<hr class="border-black/10 my-2" />');
      continue;
    }

    const headingMatch = trimmed.match(/^#{1,6}\s+(.+)$/);
    if (headingMatch) {
      closeList();
      out.push(`<h4 class="font-semibold text-sm text-tealDark pt-1">${formatInlineMarkdown(headingMatch[1].trim())}</h4>`);
      continue;
    }

    const ulMatch = line.match(/^\s*(?:[*+\-•])\s+(.+)$/);
    if (ulMatch) {
      if (openList !== 'ul') {
        closeList();
        openList = 'ul';
        out.push('<ul class="list-disc pl-5 space-y-1">');
      }
      out.push(`<li>${formatInlineMarkdown(ulMatch[1].trim())}</li>`);
      continue;
    }

    const olMatch = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (olMatch) {
      if (openList !== 'ol') {
        closeList();
        openList = 'ol';
        out.push('<ol class="list-decimal pl-5 space-y-1">');
      }
      out.push(`<li>${formatInlineMarkdown(olMatch[1].trim())}</li>`);
      continue;
    }

    closeList();
    out.push(`<p class="leading-relaxed">${formatInlineMarkdown(trimmed)}</p>`);
  }

  closeList();
  return out.join('');
}

export function stripMarkdownForSpeech(rawText) {
  return String(rawText ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/^\s*#{1,6}\s+/gm, '')
    .replace(/^\s*(?:[*+\-•]|\d+[.)])\s+/gm, '')
    .replace(/^\s*(?:[-*_]\s*){3,}$/gm, ' ')
    .replace(/[`*_]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// =========================================================
// Auto-Category Helpers (Gemini Online + Offline Classifier)
// =========================================================
const REF_ID_TO_CATEGORY = {
  paracetamol: 'Pain Relief',
  ibuprofen: 'Pain Relief',
  diclofenac: 'Pain Relief',
  aspirin: 'Pain Relief',
  amoxicillin: 'Antibiotic',
  amox_clav: 'Antibiotic',
  ampiclox: 'Antibiotic',
  azithromycin: 'Antibiotic',
  ciprofloxacin: 'Antibiotic',
  erythromycin: 'Antibiotic',
  metronidazole: 'Antibiotic',
  cefuroxime: 'Antibiotic',
  artemether_lumefantrine: 'Antimalarial',
  amodiaquine: 'Antimalarial',
  sp_malaria: 'Antimalarial',
  amlodipine: 'Blood Pressure (BP)',
  lisinopril: 'Blood Pressure (BP)',
  nifedipine: 'Blood Pressure (BP)',
  metformin: 'Diabetes',
  omeprazole: 'Antacid / Digestive',
  antacid: 'Antacid / Digestive',
  loratadine_cetirizine: 'Allergy',
  chlorpheniramine: 'Allergy',
  cough_syrup: 'Cough & Cold',
  salbutamol: 'Cough & Cold',
  vitamin_c: 'Vitamins & Tonics',
  b_complex: 'Vitamins & Tonics',
  multivitamin: 'Vitamins & Tonics',
  cyproheptadine_appetite: 'Vitamins & Tonics',
  iron_tonic: 'Vitamins & Tonics',
  cod_liver_oil: 'Vitamins & Tonics',
  antifungal_cream: 'Skin / Topical',
  triple_action_cream: 'Skin / Topical',
  topical_balm: 'Skin / Topical',
  ors: 'Oral Rehydration / Electrolytes',
  albendazole: 'Anti-parasitics',
  klovinal_vaginal: "Women's Health",
};

const OFFLINE_CATEGORY_RULES = [
  {
    category: 'Oral Rehydration / Electrolytes',
    rx: /\b(?:oral drip|orbs|ors|rehydration|electrolyte)\b/i,
    generic: 'Oral Rehydration Salts (ORS)',
  },
  {
    category: 'Diabetes',
    rx: /\b(?:glanil|glibenclamide|glimepiride|metformin|biophage|glucophage|insulin|gliclazide|diabet\w*)\b/i,
  },
  {
    category: "Women's Health",
    rx: /\b(?:klovinal|mifepak|postinor|misoprostol|mifepristone|pessary|vaginal|primolut|clomid|levonorgestrel|ergometrine)\b/i,
  },
  {
    category: 'Pediatric',
    rx: /\b(?:nospamin|gripe\s*water|infacol|teething|bonababe|pediatric|paediatric|infant\s*drop)\b/i,
  },
  {
    category: 'Pain Relief',
    rx: /\b(?:painkil|starcimol|suremol|klinfast\w*|ricam|sumo\b|piroxicam|meloxicam|tramadol|naproxen|aceclofenac|paracetamol|pcm|ibuprofen|diclofenac|aspirin|anacin|analgesic|pain)\b|\b\w*mol\b/i,
  },
  {
    category: 'Supplements',
    rx: /\b(?:complan|ensure|gluco[\s-]*joint|collagen|calcium|zinc|omega|protein|milk)\b/i,
  },
  {
    category: 'Vitamins & Tonics',
    rx: /\b(?:avroapetit|hapi[\s-]*vite|hemoforce\w*|blood\s*tonic|tonic|vite|vit\b|vitamin\w*|multivit\w*|fero\w*|iron|folic|appetit\w*|cyprivit|astymin|abidec|wellkid|wellman|wellwoman|becombion|zetup)\b/i,
  },
  {
    category: 'Eye / Ear / Nose',
    rx: /\b(?:eye\s*drop|ear\s*drop|nasal|otrivin|chloramphenicol\s*eye|gentamicin\s*eye|ophthalm\w*)\b/i,
  },
  {
    category: 'Skin / Topical',
    rx: /\b(?:abf\s*cream|cream|ointment|lotion|gel|balm|rub|derm\w*|skineal|funbact\w*|tribotan|nixoderm|epiderm|canesten|clotrimazole|topical)\b/i,
  },
  {
    category: 'Antiseptic / Wound Care',
    rx: /\b(?:dettol|savlon|spirit|iodine|hydrogen\s*peroxide|plaster|bandage|gauze|cotton\s*wool|antiseptic)\b/i,
  },
  {
    category: 'Hepatoprotectant',
    rx: /\b(?:livolin|essentiale|silymarin|liver|hepato\w*)\b/i,
  },
  {
    category: 'Antifungals',
    rx: /\b(?:fluconazole|ketoconazole\s*tab\w*|griseofulvin|terbinafine|itraconazole|nystatin|antifungal)\b/i,
  },
  {
    category: 'Anti-parasitics',
    rx: /\b(?:albendazole|mebendazole|zentel|ivermectin|praziquantel|pyrantel|worm\w*|deworm\w*)\b/i,
  },
  {
    category: 'Antibiotic',
    rx: /\b(?:amoxil|amox\w*|ampiclox|ampicillin|cloxacillin|augmentin|aquaclav|cipro\w*|azithro\w*|erythro\w*|erymed|cef\w*|ceph\w*|zinnat|doxy\w*|tetracycline|septrin|co-?trimoxazole|flagyl|metronidazole|tinidazole|levofloxacin|ofloxacin)\b|\w*(?:cillin|mycin|floxacin)\b/i,
  },
  {
    category: 'Antimalarial',
    rx: /\b(?:artem\w*|lumefantrine|amodiaquine|amatem\w*|lonart\w*|coartem|fansidar|amalar|maloxine|chloroquine|quinine|camoquin|larimal|malaria)\b/i,
  },
  {
    category: 'Blood Pressure (BP)',
    rx: /\b(?:amlodipine|nifedipine|lisinopril|losartan|valsartan|atenolol|propranolol|methyldopa|moduretic|hydrochlorothiazide|furosemide|lasix|norvasc|bp)\b|\w*(?:dipine|sartan|pril|olol)\b/i,
  },
  {
    category: 'Antacid / Digestive',
    rx: /\b(?:omeprazole|rabeprazole|pantoprazole|esomeprazole|cimetidine|famotidine|ranitidine|antacid|mist\s*mag|gaviscon|gestid|avrocid|gecrol|acipep|buscopan|loperamide|imodium|dulcolax|bisacodyl|lactulose|ulcer|gastr\w*)\b/i,
  },
  {
    category: 'Cough & Cold',
    rx: /\b(?:cough|cold|catarrh|benylin|emzolyn|tuxil\w*|cofmix|lozenge\w*|strepsil\w*|salbutamol|ventolin|inhaler|expectorant|mucus|decongest\w*)\b/i,
  },
  {
    category: 'Allergy',
    rx: /\b(?:loratadine|cetirizine|piriton|chlorpheniramine|fexofenadine|desloratadine|promethazine|clarityn|zyrtec|allergy)\b/i,
  },
];

export function getCanonicalCategoryList(meds = []) {
  const seen = new Set();
  const ordered = [];

  for (const cat of STANDARD_CATEGORIES.filter(c => c !== 'Other')) {
    seen.add(cat.toLowerCase());
    ordered.push(cat);
  }

  for (const m of meds || []) {
    const raw = String(m?.category ?? '').trim();
    if (!raw) continue;
    const low = raw.toLowerCase();
    if (MESSY_CATEGORY_ALIASES.has(low)) continue;
    if (!seen.has(low)) {
      seen.add(low);
      ordered.push(raw);
    }
  }

  ordered.push('Other');
  return ordered;
}

export function guessCategoryOffline(medName, existingMed = null) {
  const name = String(medName ?? existingMed?.name ?? '').trim();
  const baseMed = { ...(existingMed || {}), name };
  const meta = inferGenericAndCompany(baseMed);
  const company = meta.company || '';

  if (!name) {
    return {
      category: 'Other',
      generic_name: meta.generic || '',
      company,
      confidence: 'low',
      reason: 'Enter a medication name first.',
      mode: 'local',
    };
  }

  // Oral antifungals explicitly marked as tab/cap take priority over topical cream ref
  if (/\b(?:fluconazole|ketoconazole\s+tab\w*|griseofulvin|terbinafine|itraconazole)\b/i.test(name)) {
    return {
      category: 'Antifungals',
      generic_name: meta.generic || '',
      company,
      confidence: 'high',
      reason: 'Matched oral antifungal pattern',
      mode: 'local',
    };
  }

  const ref = meta.ref || matchDrugReference(baseMed);
  if (ref && REF_ID_TO_CATEGORY[ref.id]) {
    return {
      category: REF_ID_TO_CATEGORY[ref.id],
      generic_name: meta.generic || ref.generic || '',
      company,
      confidence: 'high',
      reason: `Matched drug reference (${ref.generic})`,
      mode: 'local',
    };
  }

  for (const rule of OFFLINE_CATEGORY_RULES) {
    if (rule.rx.test(name)) {
      return {
        category: rule.category,
        generic_name: meta.generic || rule.generic || '',
        company,
        confidence: 'medium',
        reason: `Matched pharmacy brand/keyword rule (${rule.category})`,
        mode: 'local',
      };
    }
  }

  return {
    category: 'Other',
    generic_name: meta.generic || '',
    company,
    confidence: 'low',
    reason: 'No exact offline match — use AI Auto-Category online or select manually',
    mode: 'local',
  };
}

export async function autoCategorizeMedication({
  supabase,
  name,
  existingCategories = [],
}) {
  const cleanName = String(name ?? '').trim();
  const local = guessCategoryOffline(cleanName);

  if (!cleanName || !supabase?.functions?.invoke) {
    return { ...local, mode: 'local' };
  }

  const allowed = existingCategories.length ? existingCategories : STANDARD_CATEGORIES;

  try {
    const { data, error } = await supabase.functions.invoke('pharmacy-ai', {
      body: {
        action: 'categorize',
        medicationName: cleanName,
        existingCategories: allowed,
      },
    });

    if (!error && data?.configured === true && data?.mode === 'gemini' && data?.result?.category) {
      const r = data.result;
      const finalCategory = r.category === 'Other' && local.category !== 'Other'
        ? local.category
        : r.category;
      return {
        category: finalCategory,
        generic_name: r.generic_name || local.generic_name || '',
        company: r.company || local.company || '',
        confidence: r.confidence || 'high',
        reason: r.reason || `Classified by Gemini Cloud AI (${finalCategory})`,
        mode: 'gemini',
        model: data.model || null,
      };
    }

    return {
      ...local,
      mode: 'local',
      statusNote: data?.message || '',
    };
  } catch {
    return { ...local, mode: 'local' };
  }
}

export async function batchAutoCategorizeMedications({
  supabase,
  items = [],
  existingCategories = [],
}) {
  const cleanItems = (items || []).filter(it => it && String(it.name ?? '').trim().length > 0);
  if (cleanItems.length === 0) {
    return { mode: 'local', model: null, statusNote: '', results: [] };
  }

  const allowed = existingCategories.length ? existingCategories : STANDARD_CATEGORIES;
  const CHUNK_SIZE = 30;
  const geminiById = new Map();
  let anyGemini = false;
  let lastModel = null;
  let statusNote = '';

  if (supabase?.functions?.invoke) {
    for (let i = 0; i < cleanItems.length; i += CHUNK_SIZE) {
      const chunk = cleanItems.slice(i, i + CHUNK_SIZE).map(it => ({
        id: String(it.id),
        name: String(it.name).trim(),
        company: it.company ? String(it.company).trim() : '',
        generic_name: it.generic_name ? String(it.generic_name).trim() : '',
      }));

      try {
        const { data, error } = await supabase.functions.invoke('pharmacy-ai', {
          body: {
            action: 'batch_categorize',
            items: chunk,
            existingCategories: allowed,
          },
        });

        if (!error && data?.configured === true && data?.mode === 'gemini' && Array.isArray(data?.results)) {
          anyGemini = true;
          if (data.model) lastModel = data.model;
          for (const entry of data.results) {
            if (entry && entry.id != null) {
              geminiById.set(String(entry.id), entry);
            }
          }
        } else if (data?.message) {
          statusNote = data.message;
        }
      } catch {
        // Fall back to local classifier per item
      }
    }
  }

  const results = cleanItems.map(it => {
    const idStr = String(it.id);
    const local = guessCategoryOffline(it.name, it);
    const online = geminiById.get(idStr);

    if (online && online.category) {
      const resolvedCategory = online.category === 'Other' && local.category !== 'Other'
        ? local.category
        : online.category;
      return {
        id: it.id,
        name: it.name,
        category: resolvedCategory,
        generic_name: online.generic_name || local.generic_name || '',
        company: online.company || local.company || '',
        confidence: online.confidence || 'high',
        reason: online.reason || `Classified by Gemini Cloud AI (${resolvedCategory})`,
        mode: 'gemini',
      };
    }

    return {
      id: it.id,
      name: it.name,
      category: local.category,
      generic_name: local.generic_name,
      company: local.company,
      confidence: local.confidence,
      reason: local.reason,
      mode: 'local',
    };
  });

  return {
    mode: anyGemini ? 'gemini' : 'local',
    model: lastModel,
    statusNote,
    results,
  };
}

// =========================================================
// Duplicate Medication Detection & Safe Merge Helpers
// =========================================================
const VARIANT_MODIFIER_RX =
  /\b(?:big|small|medium|large|adult|adults|child|children|pediatric|paediatric|infant|syrup|suspension|tablet|tablets|tab|tabs|capsule|capsules|cap|caps|cream|gel|ointment|injection|inj|drops|pessary|forte|extra|plus|dm|counting|\d+\s*(?:mg|mcg|ml|g)|by\s*\d+|x\s*\d+)\b/gi;

export function normalizeMedicationNameKey(name) {
  return String(name ?? '')
    .trim()
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export function findDuplicateMedication(name, meds = [], excludeId = null) {
  const key = normalizeMedicationNameKey(name);
  if (!key) return null;
  const alpha = key.replace(/[^a-z0-9]/g, '');

  for (const m of meds || []) {
    if (!m || (excludeId != null && String(m.id) === String(excludeId))) continue;
    const mk = normalizeMedicationNameKey(m.name);
    if (mk === key) return m;
    if (alpha.length >= 4 && mk.replace(/[^a-z0-9]/g, '') === alpha) return m;
  }
  return null;
}

function sortDuplicateGroupItems(items) {
  return [...items].sort((a, b) => {
    const aCap = /^[A-Z]/.test(String(a.name || '').trim()) ? 1 : 0;
    const bCap = /^[A-Z]/.test(String(b.name || '').trim()) ? 1 : 0;
    if (bCap !== aCap) return bCap - aCap;

    const aCleanHyphen = /\s+-\s*|\s*-\s+/.test(String(a.name || '')) ? 0 : 1;
    const bCleanHyphen = /\s+-\s*|\s*-\s+/.test(String(b.name || '')) ? 0 : 1;
    if (bCleanHyphen !== aCleanHyphen) return bCleanHyphen - aCleanHyphen;

    const aPrices = getAllAvailablePrices(a).length;
    const bPrices = getAllAvailablePrices(b).length;
    if (bPrices !== aPrices) return bPrices - aPrices;

    const aNonOther = String(a.category || '').trim().toLowerCase() !== 'other' ? 1 : 0;
    const bNonOther = String(b.category || '').trim().toLowerCase() !== 'other' ? 1 : 0;
    if (bNonOther !== aNonOther) return bNonOther - aNonOther;

    return String(a.name || '').length - String(b.name || '').length
      || String(a.name || '').localeCompare(String(b.name || ''));
  });
}

function extractVariantSignature(name) {
  const raw = normalizeText(name);
  const matches = raw.match(VARIANT_MODIFIER_RX) || [];
  const norm = matches.map(t => t.replace(/\s+/g, '')).sort();
  return [...new Set(norm)].join('|');
}

function extractBaseNameWithoutGenericParens(name, genericNorm) {
  const stripped = String(name ?? '').replace(/\(([^)]+)\)/g, (_m, inner) => {
    const innerNorm = normalizeText(inner);
    if (genericNorm && innerNorm === genericNorm) return '';
    return ` ${inner} `;
  });
  return normalizeMedicationNameKey(stripped)
    .replace(/\s+/g, ' ')
    .trim();
}

export function findPotentialDuplicateGroups(meds = []) {
  const active = (meds || []).filter(m => m && m.is_active !== false && String(m.name || '').trim());
  const groups = [];
  const groupedIds = new Set();

  // 1. Exact case / spacing / hyphen / punctuation duplicates
  const byExact = new Map();
  for (const m of active) {
    const key = normalizeMedicationNameKey(m.name);
    const alpha = key.replace(/[^a-z0-9]/g, '');
    const bucketKey = alpha.length >= 4 ? `alpha:${alpha}` : `key:${key}`;
    if (!byExact.has(bucketKey)) byExact.set(bucketKey, []);
    byExact.get(bucketKey).push(m);
  }

  for (const list of byExact.values()) {
    if (list.length >= 2) {
      const sorted = sortDuplicateGroupItems(list);
      sorted.forEach(m => groupedIds.add(String(m.id)));
      groups.push({
        reason: 'Same name (capitalization / spacing difference)',
        items: sorted,
      });
    }
  }

  // 2. Near-duplicates sharing exact base name (e.g. "Biophage" vs "Biophage (Metformin)") + generic
  const byBase = new Map();
  for (const m of active) {
    if (groupedIds.has(String(m.id))) continue;
    const meta = inferGenericAndCompany(m);
    const genericNorm = normalizeText(meta.generic || '');
    if (!genericNorm) continue;

    const base = extractBaseNameWithoutGenericParens(m.name, genericNorm);
    if (!base) continue;

    const companyNorm = normalizeText(meta.company || '');
    const variantSig = extractVariantSignature(m.name);
    const key = `${base}::${genericNorm}::${companyNorm}::${variantSig}`;
    if (!byBase.has(key)) byBase.set(key, []);
    byBase.get(key).push(m);
  }

  for (const list of byBase.values()) {
    if (list.length >= 2) {
      const sorted = sortDuplicateGroupItems(list);
      groups.push({
        reason: 'Same brand, ingredient & strength (extra label)',
        items: sorted,
      });
    }
  }

  return groups;
}
