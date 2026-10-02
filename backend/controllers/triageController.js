const TriageCase = require("../models/TriageCase");
const { success, fail } = require("../utils/apiResponse");

const DISCLAIMER =
    "This AI triage tool provides guidance based on symptom patterns but is NOT a substitute for professional medical diagnosis. " +
    "Always consult a licensed healthcare provider for proper evaluation and treatment. " +
    "If you believe you are experiencing a medical emergency, call your local emergency number (102 in India) immediately.";

// Hospital doctors database for intelligent recommendations
const HOSPITAL_DOCTORS = [
    { name: "Dr. Sharma", specialization: "Cardiologist", keywords: ["heart", "chest pain", "chest", "palpitation", "cardiac", "blood pressure", "bp", "hypertension", "cholesterol"], fee: 800 },
    { name: "Dr. Mehta", specialization: "Neurologist", keywords: ["headache", "migraine", "brain", "nerve", "seizure", "epilepsy", "stroke", "dizziness", "vertigo", "numbness", "tingling", "memory", "confusion"], fee: 750 },
    { name: "Dr. Singh", specialization: "Orthopedic", keywords: ["bone", "joint", "fracture", "sprain", "back pain", "knee", "shoulder", "hip", "spine", "arthritis", "muscle pain", "orthopedic", "sports injury"], fee: 600 },
    { name: "Dr. Verma", specialization: "Dermatologist", keywords: ["skin", "rash", "acne", "pimple", "eczema", "psoriasis", "hair loss", "nail", "mole", "itching", "dermatitis", "allergy skin"], fee: 550 },
    { name: "Dr. Patel", specialization: "Pediatrician", keywords: ["child", "baby", "infant", "fever child", "cough child", "vaccination", "growth", "development", "newborn", "kids"], fee: 400 },
    { name: "Dr. Gupta", specialization: "Oncologist", keywords: ["cancer", "tumor", "lump", "mass", "oncology", "chemotherapy", "radiation", "biopsy abnormal"], fee: 900 },
    { name: "Dr. Kumar", specialization: "General Surgeon", keywords: ["surgery", "operation", "appendicitis", "hernia", "gallbladder", "surgical", "wound", "abscess"], fee: 500 },
    { name: "Dr. Reddy", specialization: "ENT Specialist", keywords: ["ear", "nose", "throat", "sinus", "tonsil", "hearing", "sore throat", "nasal", "allergy", "sneezing", "blocked nose"], fee: 500 },
    { name: "Dr. Iyer", specialization: "Ophthalmologist", keywords: ["eye", "vision", "blurry", "cataract", "glaucoma", "red eye", "eye pain", "spectacles", "contact lens"], fee: 500 },
    { name: "Dr. Nair", specialization: "Psychiatrist", keywords: ["depression", "anxiety", "stress", "mental", "mood", "sleep problem", "insomnia", "panic", "ocd", "ptsd", "psychiatrist", "therapy"], fee: 450 },
    { name: "Dr. Joshi", specialization: "Gynecologist", keywords: ["period", "menstrual", "pregnancy", "pcos", "fibroid", "cervical", "pap smear", "menopause", "women health", "ovary", "uterus"], fee: 600 },
    { name: "Dr. Rao", specialization: "Urologist", keywords: ["urinary", "kidney stone", "bladder", "prostate", "urology", "urine", "incontinence", "kidney pain"], fee: 650 },
    { name: "Dr. Desai", specialization: "Gastroenterologist", keywords: ["stomach", "abdominal", "digestion", "gastric", "acidity", "ulcer", "liver", "pancreas", "ibs", "constipation", "diarrhea", "vomiting"], fee: 600 },
    { name: "Dr. Malhotra", specialization: "Pulmonologist", keywords: ["lungs", "breathing", "asthma", "copd", "tb", "tuberculosis", "cough", "shortness of breath", "respiratory", "pneumonia", "bronchitis"], fee: 550 },
    { name: "Dr. Banerjee", specialization: "Nephrologist", keywords: ["kidney", "dialysis", "renal", "proteinuria", "creatinine", "kidney failure", "transplant"], fee: 600 },
    { name: "Dr. Choudhary", specialization: "Endocrinologist", keywords: ["diabetes", "thyroid", "hormone", "diabetes type", "insulin", "tsh", "pcos hormone", "endocrine", "pituitary"], fee: 500 },
    { name: "Dr. Saxena", specialization: "Rheumatologist", keywords: ["arthritis", "rheumatoid", "lupus", "autoimmune", "joint inflammation", "rheumatic", "ankylosing", "gout"], fee: 500 },
    { name: "Dr. Khanna", specialization: "Plastic Surgeon", keywords: ["cosmetic", "plastic surgery", "reconstruction", "burn", "scar", "cosmetic procedure", "rhinoplasty"], fee: 1000 },
    { name: "Dr. Agarwal", specialization: "Dentist", keywords: ["tooth", "toothache", "cavity", "root canal", "dental", "gum", "teeth", "wisdom tooth", "bleeding gums"], fee: 350 },
    { name: "Dr. Bhatia", specialization: "Physiotherapist", keywords: ["physiotherapy", "rehabilitation", "physical therapy", "exercise therapy", "post surgery rehab", "mobility"], fee: 400 },
    { name: "Dr. Menon", specialization: "Radiologist", keywords: ["x-ray", "ct scan", "mri", "ultrasound", "imaging", "radiology", "sonography", "scan"], fee: 450 },
    { name: "Dr. Yadav", specialization: "Pathologist", keywords: ["blood test", "lab test", "pathology", "biopsy", "report", "pathology report", "cbc", "culture"], fee: 400 },
    { name: "Dr. Pandey", specialization: "Anesthesiologist", keywords: ["anesthesia", "pain management", "epidural", "surgical anesthesia", "chronic pain"], fee: 450 },
    { name: "Dr. Ghosh", specialization: "Hematologist", keywords: ["blood disorder", "anemia", "thalassemia", "hemophilia", "blood cancer", "leukemia", "lymphoma", "clotting"], fee: 500 },
    { name: "Dr. Kapoor", specialization: "General Physician", keywords: ["fever", "cold", "flu", "infection", "general checkup", "preventive care", "vaccination adult", "mild fever", "body ache", "weakness", "tired", "general weakness"], fee: 400 },
    { name: "Dr. Jain", specialization: "Infectious Disease Specialist", keywords: ["malaria", "dengue", "typhoid", "chikungunya", "viral fever", "infection", "sepsis", "hiv", "tuberculosis", "infectious", "fever with chills", "travel illness"], fee: 550 },
    { name: "Dr. Arora", specialization: "Vascular Surgeon", keywords: ["varicose veins", "circulation", "blood clot", "dvt", "artery blockage", "vascular", "leg swelling", "gangrene", "bypass surgery", "carotid"], fee: 750 },
    { name: "Dr. Prasad", specialization: "Geriatrician", keywords: ["elderly", "old age", "senior citizen", "dementia", "alzheimer", "memory loss old", "fall risk", "frailty", "polypharmacy", "aging"], fee: 500 },
    { name: "Dr. Kaur", specialization: "Sports Medicine Specialist", keywords: ["sports injury", "athletic", "runner knee", "tennis elbow", "acl", "meniscus", "concussion sports", "fitness injury", "gym injury", "performance"], fee: 600 },
    { name: "Dr. Mishra", specialization: "Allergist & Immunologist", keywords: ["allergy", "food allergy", "pollen", "dust allergy", "asthma allergy", "immune deficiency", "autoimmune", "urticaria", "sinus allergy", "hay fever"], fee: 500 }
];

// Emergency keywords that require immediate attention
const EMERGENCY_KEYWORDS = [
    "heart attack", "cardiac arrest", "severe chest pain", "can't breathe", "choking",
    "unconscious", "not breathing", "severe bleeding", "bleeding heavily", "seizure",
    "stroke", "poisoning", "overdose", "suicide", "severe burn", "allergic reaction",
    "anaphylaxis", "broken bone", "fracture visible", "head injury", "severe trauma",
    "pregnancy emergency", "labor pain", "water broke", "severe abdominal pain"
];

// Symptom to condition mapping for intelligent recommendations
const SYMPTOM_PATTERNS = {
    fever: { possible: ["Viral infection", "Bacterial infection", "Malaria", "Dengue", "Typhoid"], department: "General Physician" },
    cough: { possible: ["Common cold", "Bronchitis", "Pneumonia", "COVID-19", "Allergic rhinitis"], department: "Pulmonologist" },
    headache: { possible: ["Tension headache", "Migraine", "Sinusitis", "Eye strain", "Dehydration"], department: "Neurologist" },
    "chest pain": { possible: ["Angina", "Heart attack", "GERD", "Muscle strain", "Anxiety"], department: "Cardiologist" },
    fatigue: { possible: ["Anemia", "Thyroid disorder", "Diabetes", "Depression", "Chronic fatigue"], department: "General Physician" },
    "stomach pain": { possible: ["Gastritis", "Appendicitis", "IBS", "Food poisoning", "Kidney stones"], department: "Gastroenterologist" },
    rash: { possible: ["Allergic reaction", "Eczema", "Viral exanthem", "Fungal infection", "Psoriasis"], department: "Dermatologist" },
    "shortness of breath": { possible: ["Asthma", "Pneumonia", "Heart failure", "COPD", "Anxiety"], department: "Pulmonologist" },
    "joint pain": { possible: ["Arthritis", "Sprain", "Gout", "Rheumatoid arthritis", "Osteoarthritis"], department: "Orthopedic" },
    depression: { possible: ["Major depression", "Anxiety disorder", "Bipolar disorder", "Adjustment disorder"], department: "Psychiatrist" },
    diabetes: { possible: ["Type 1 Diabetes", "Type 2 Diabetes", "Prediabetes", "Diabetic complications"], department: "Endocrinologist" },
    pregnancy: { possible: ["Normal pregnancy", "High-risk pregnancy", "Gestational diabetes", "Preeclampsia"], department: "Gynecologist" }
};

function findRecommendedDoctors(symptoms, suggestedDepartment = null) {
    const textBlob = symptoms.join(" ").toLowerCase();
    const scoredDoctors = HOSPITAL_DOCTORS.map(doctor => {
        let score = 0;
        doctor.keywords.forEach(keyword => {
            if (textBlob.includes(keyword.toLowerCase())) {
                score += 1;
                // Extra weight for exact phrase matches
                if (textBlob.includes(keyword.toLowerCase() + " ") || 
                    textBlob.includes(" " + keyword.toLowerCase())) {
                    score += 0.5;
                }
            }
        });
        // Boost score if doctor matches the suggested department
        if (suggestedDepartment && doctor.specialization === suggestedDepartment) {
            score += 2;
        }
        return { ...doctor, score };
    }).filter(d => d.score > 0).sort((a, b) => b.score - a.score);

    // If no doctors matched but we have a suggested department, find a doctor from that department
    if (scoredDoctors.length === 0 && suggestedDepartment) {
        const deptDoctor = HOSPITAL_DOCTORS.find(d => d.specialization === suggestedDepartment);
        if (deptDoctor) {
            scoredDoctors.push({ ...deptDoctor, score: 1 });
        }
    }

    // Always ensure General Physician is in the list when suggested
    if (suggestedDepartment === "General Physician") {
        const gpDoctor = HOSPITAL_DOCTORS.find(d => d.specialization === "General Physician");
        const alreadyIncluded = scoredDoctors.some(d => d.specialization === "General Physician");
        if (gpDoctor && !alreadyIncluded) {
            scoredDoctors.unshift({ ...gpDoctor, score: scoredDoctors.length > 0 ? scoredDoctors[0].score + 1 : 3 });
        }
    }

    return scoredDoctors.slice(0, 3); // Return top 3 matches
}

function analyzeWithIntelligence(symptoms, severity, description = "") {
    const textBlob = symptoms.join(" ").toLowerCase() + " " + description.toLowerCase();
    
    // Check for emergency keywords
    const isEmergency = EMERGENCY_KEYWORDS.some(keyword => textBlob.includes(keyword.toLowerCase()));
    
    // Find matching symptom patterns
    let possibleConditions = [];
    let suggestedDepartment = "General Physician";
    
    Object.entries(SYMPTOM_PATTERNS).forEach(([pattern, data]) => {
        if (textBlob.includes(pattern.toLowerCase())) {
            possibleConditions = [...possibleConditions, ...data.possible];
            suggestedDepartment = data.department;
        }
    });
    
    // Remove duplicates from possible conditions
    possibleConditions = [...new Set(possibleConditions)].slice(0, 3);
    
    // Find recommended doctors
    const recommendedDoctors = findRecommendedDoctors(symptoms.concat(description ? [description] : []), suggestedDepartment);
    
    // Determine urgency and recommendation
    let urgency, confidence, recommendation;
    
    if (isEmergency || severity === "High") {
        urgency = "emergency";
        confidence = 0.92;
        recommendation = "URGENT: Based on the symptoms described, this appears to be a potentially serious condition requiring immediate medical attention. Please go to the emergency department immediately or call emergency services (102).";
    } else if (severity === "Medium" || possibleConditions.length > 0) {
        urgency = "same_day";
        confidence = 0.78;
        if (recommendedDoctors.length > 0) {
            const topDoctor = recommendedDoctors[0];
            recommendation = `Based on your symptoms, I recommend consulting ${topDoctor.name} (${topDoctor.specialization}). `;
            if (possibleConditions.length > 0) {
                recommendation += `Possible conditions to discuss: ${possibleConditions.join(", ")}. `;
            }
            recommendation += "Please book a same-day appointment for proper evaluation.";
        } else {
            recommendation = `I recommend consulting a ${suggestedDepartment}. Please book a same-day appointment for proper evaluation.`;
        }
    } else {
        urgency = "routine";
        confidence = 0.65;
        recommendation = "Your symptoms appear mild. Monitor your condition, stay hydrated, and get adequate rest. If symptoms persist for more than 2-3 days or worsen, please consult a General Physician.";
    }
    
    return {
        urgency,
        confidence,
        recommendation,
        disclaimer: DISCLAIMER,
        possibleConditions,
        suggestedDepartment,
        recommendedDoctors,
        isEmergency
    };
}

// Legacy analyze function for backward compatibility
function analyze(symptoms, severity) {
    return analyzeWithIntelligence(symptoms, severity);
}

// Optional: External AI integration via Hugging Face (free tier)
async function analyzeWithExternalAI(description, symptoms) {
    try {
        const HF_API_KEY = process.env.HF_API_KEY;
        if (!HF_API_KEY) return null;
        
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `<s>[INST] You are a medical triage assistant. Given these symptoms: ${symptoms.join(", ")}. Description: ${description}. Provide a brief 2-sentence assessment and suggest which type of doctor to see. Be cautious and recommend seeing a doctor for proper diagnosis. [/INST]`,
                parameters: { max_new_tokens: 150, temperature: 0.3 }
            })
        });
        
        if (!response.ok) return null;
        
        const data = await response.json();
        if (data && data[0] && data[0].generated_text) {
            return data[0].generated_text.split("[/INST]")[1]?.trim() || data[0].generated_text;
        }
        return null;
    } catch (e) {
        console.log("External AI unavailable, using local analysis");
        return null;
    }
}

exports.runTriage = async (req, res, next) => {
    try {
        const { symptoms, severity, description = "" } = req.body;
        
        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            return fail(res, "Please select at least one symptom", null, 400);
        }
        
        // Run intelligent analysis
        const analysis = analyzeWithIntelligence(symptoms, severity, description);
        
        // Try external AI for additional insights (optional, non-blocking)
        let externalAIResponse = null;
        if (description && description.length > 10) {
            externalAIResponse = await analyzeWithExternalAI(description, symptoms);
        }
        
        // Build comprehensive recommendation
        let finalRecommendation = analysis.recommendation;
        if (externalAIResponse) {
            finalRecommendation += `\n\nAI Assessment: ${externalAIResponse}`;
        }
        
        // Add doctor recommendations to the response
        if (analysis.recommendedDoctors && analysis.recommendedDoctors.length > 0) {
            const doctorList = analysis.recommendedDoctors.map(d => 
                `${d.name} (${d.specialization}) - Consultation: ₹${d.fee}`
            ).join(" | ");
            finalRecommendation += `\n\nRecommended Doctors: ${doctorList}`;
        }

        const triageCase = await TriageCase.create({
            user: req.user.id,
            symptoms,
            severity,
            urgency: analysis.urgency,
            recommendation: finalRecommendation,
            confidence: analysis.confidence,
            disclaimer: analysis.disclaimer,
            possibleConditions: analysis.possibleConditions,
            suggestedDepartment: analysis.suggestedDepartment,
            recommendedDoctors: analysis.recommendedDoctors,
            isEmergency: analysis.isEmergency,
            description: description
        });

        return success(res, "AI triage analysis complete", {
            caseId: triageCase._id,
            symptoms,
            severity,
            urgency: analysis.urgency,
            confidence: analysis.confidence,
            recommendation: finalRecommendation,
            disclaimer: analysis.disclaimer,
            possibleConditions: analysis.possibleConditions,
            suggestedDepartment: analysis.suggestedDepartment,
            recommendedDoctors: analysis.recommendedDoctors,
            isEmergency: analysis.isEmergency,
            hasExternalAI: !!externalAIResponse
        });
    } catch (err) {
        next(err);
    }
};

exports.getHistory = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
        const skip = (page - 1) * limit;

        const [cases, total] = await Promise.all([
            TriageCase.find({ user: req.user.id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-__v")
                .lean(),
            TriageCase.countDocuments({ user: req.user.id })
        ]);

        return success(res, "Triage history", {
            cases,
            pagination: {
                page,
                limit,
                total,
                pages: Math.max(1, Math.ceil(total / limit))
            }
        });
    } catch (err) {
        next(err);
    }
};
