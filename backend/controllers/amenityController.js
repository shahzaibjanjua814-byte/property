export const searchAmenities = async (req, res) => {
    try {
        const { area, amenity, q } = req.query;
        const amenityDatabase = {
            "karachi": {
                "Top Schools": [
                    { name: "Aitchison College", description: "Premier educational institution in Karachi with excellent academics" },
                    { name: "Lycee Francais de Karachi", description: "International school offering French curriculum" },
                    { name: "Karachi Grammar School", description: "Leading independent school with strong reputation" },
                    { name: "Beaconhouse School System", description: "Modern educational system with multiple branches" },
                    { name: "Nixor College", description: "Top-tier college in Defence, Karachi" }
                ],
                "Healthcare": [
                    { name: "Aga Khan Hospital", description: "State-of-the-art healthcare facility with specialist doctors" },
                    { name: "Liaquat National Hospital", description: "Major hospital providing comprehensive medical services" },
                    { name: "Ziauddin Medical Center", description: "Multi-specialty hospital with modern equipment" },
                    { name: "Pacific Medical Complex", description: "Advanced healthcare center for emergency and routine care" },
                    { name: "Sindh Institute of Urology", description: "Specialized urology hospital" }
                ],
                "Shopping": [
                    { name: "Dolmen Mall Karachi", description: "Premium shopping destination with international brands" },
                    { name: "Serena Hotel", description: "Luxury shopping and dining complex in Clifton" },
                    { name: "Atrium Mall", description: "Modern retail center with cafes and restaurants" },
                    { name: "Lucky One Mall", description: "Large shopping mall with entertainment options" },
                    { name: "Hyperstar", description: "Popular supermarket chain with multiple locations" }
                ],
                "Transport Links": [
                    { name: "Jinnah International Airport", description: "Main airport connecting Pakistan to international destinations" },
                    { name: "Karachi Port Trust", description: "Major seaport for international trade" },
                    { name: "Orange Line Metro", description: "Modern public transportation system" },
                    { name: "Karachiway Motorway", description: "Highway connecting major areas of the city" },
                    { name: "City Bus Service", description: "Comprehensive public transport network" }
                ],
                "Parks": [
                    { name: "Port Grand Park", description: "Waterfront park with recreational facilities and food stalls" },
                    { name: "Jilani Park", description: "Large public park with walking trails and green spaces" },
                    { name: "Hill Park", description: "Scenic hilltop park with panoramic views of the city" },
                    { name: "Sea View Park", description: "Coastal park with beach access and sunset views" },
                    { name: "Clifton Beach", description: "Popular beach destination in Karachi" }
                ],
                "Safe Area": [
                    { name: "Defence Housing Authority (DHA)", description: "Gated community with 24/7 security" },
                    { name: "Clifton", description: "Upscale residential area with high security" },
                    { name: "Bath Island", description: "Secure residential community" },
                    { name: "Gulberg", description: "Established neighborhood with good security" }
                ]
            },
            "lahore": {
                "Top Schools": [
                    { name: "Aitchison College Lahore", description: "Elite boarding school with international standards" },
                    { name: "Lahore Grammar School", description: "Leading educational institution in Punjab" },
                    { name: "Beaconhouse School", description: "Modern school with advanced learning facilities" },
                    { name: "PAF College Lahore", description: "Military school with strict discipline and excellence" },
                    { name: "Fazaia Schools", description: "Air Force schools with quality education" }
                ],
                "Healthcare": [
                    { name: "Shaukat Khanum Hospital", description: "Top cancer hospital with specialist oncologists" },
                    { name: "Fatima Memorial Hospital", description: "Leading healthcare provider in Lahore" },
                    { name: "Combined Military Hospital", description: "Major military hospital with advanced equipment" },
                    { name: "Services Hospital", description: "Government hospital providing quality healthcare" },
                    { name: "Ittefaq Hospital", description: "Multi-specialty hospital in Lahore" }
                ],
                "Shopping": [
                    { name: "Packages Mall", description: "Premium shopping center with luxury brands" },
                    { name: "Emporium Mall", description: "High-end retail destination in Gulberg" },
                    { name: "Liberty Market", description: "Historic shopping area with traditional and modern shops" },
                    { name: "Mall Road", description: "Famous street with international retail brands" },
                    { name: "Galleria", description: "Modern shopping complex with restaurants" }
                ],
                "Transport Links": [
                    { name: "Allama Iqbal International Airport", description: "Main airport serving Lahore and region" },
                    { name: "Lahore Railway Station", description: "Historic station connecting major cities" },
                    { name: "Orange Line Metro", description: "Modern rapid transit system across the city" },
                    { name: "Grand Trunk Road", description: "Historic highway connecting northern cities" },
                    { name: "Lahore Circular Railway", description: "Commuter rail service connecting neighborhoods" }
                ],
                "Parks": [
                    { name: "Jilani Park Lahore", description: "Large public park in city center with jogging track" },
                    { name: "Racecourse Park", description: "Historic park with sports facilities and events" },
                    { name: "Lawrence Garden", description: "Beautiful botanical garden with rare plants" },
                    { name: "Mall Road Park", description: "Urban park with recreational activities" },
                    { name: "Thokar Niaz Baig Park", description: "Modern park with playgrounds" }
                ],
                "Safe Area": [
                    { name: "DHA Lahore", description: "Premium gated community with top security" },
                    { name: "Defence Colony", description: "Established safe residential area" },
                    { name: "Cantt Area", description: "Military cantonment with excellent security" },
                    { name: "Gulberg", description: "Upscale neighborhood with gated communities" }
                ]
            },
            "islamabad": {
                "Top Schools": [
                    { name: "Islamabad Model College", description: "Premier educational institution in the capital" },
                    { name: "FAST School Islamabad", description: "Modern school with technology focus" },
                    { name: "Roots School", description: "Leading private school in Islamabad" },
                    { name: "Army Public School Islamabad", description: "Military-managed school with excellent standards" },
                    { name: "Cadet College Islamabad", description: "Premier boarding school for boys" }
                ],
                "Healthcare": [
                    { name: "Pakistan Institute of Medical Sciences (PIMS)", description: "Major government hospital in Islamabad" },
                    { name: "Shifa International Hospital", description: "Top private hospital with all specialties" },
                    { name: "Poly Clinic Hospital", description: "Multi-specialty hospital in city center" },
                    { name: "Federal Government Hospital", description: "Government healthcare facility" },
                    { name: "HNP Civil Hospital", description: "Public hospital in Islamabad" }
                ],
                "Shopping": [
                    { name: "Centaurus Mall", description: "Premium shopping mall in Blue Area" },
                    { name: "F-7 Shopping Center", description: "Elite shopping destination in Islamabad" },
                    { name: "Rawal Trade Centre", description: "Commercial hub with shops and offices" },
                    { name: "Blue Area Market", description: "High-end shopping and dining district" },
                    { name: "Jinnah Supermarket", description: "Popular shopping destination" }
                ],
                "Transport Links": [
                    { name: "New Islamabad International Airport", description: "Modern international airport" },
                    { name: "Grand Trunk Road", description: "Major highway connecting cities" },
                    { name: "Motorway Network", description: "Expressway system for quick connectivity" },
                    { name: "Blue Bus Service", description: "Public transportation system" },
                    { name: "Margalla Road", description: "Main arterial road in Islamabad" }
                ],
                "Parks": [
                    { name: "Margalla Hills National Park", description: "Beautiful hills with trekking trails and hiking" },
                    { name: "Rawal Lake", description: "Scenic lake with recreational facilities" },
                    { name: "F-9 Park", description: "Large central park in Islamabad" },
                    { name: "Shakarparian", description: "Historic park with viewpoint overlooking city" },
                    { name: "Zero Point Park", description: "Popular recreational area" }
                ],
                "Safe Area": [
                    { name: "DHA Islamabad", description: "Premium gated community with high security" },
                    { name: "F-7 Sector", description: "Diplomatic area with excellent security" },
                    { name: "G-6 Sector", description: "Secure residential sector" },
                    { name: "Bahria Town Islamabad", description: "Master-planned community with security" }
                ]
            }
        };

        const normalizedArea = (area || "").toLowerCase().trim();
        const normalizedAmenity = (amenity || "").toLowerCase().trim().replace(/\s+/g, ' ');
        const areaData = amenityDatabase[normalizedArea];

        let results = [];
        if (areaData) {
            for (const [key, list] of Object.entries(areaData)) {
                if (key.toLowerCase() === normalizedAmenity) {
                    results = list;
                    break;
                }
            }
        }

        if (results.length === 0) {
            results = [{ name: "Not Found", description: `No specific data found for ${amenity} in ${area}.` }];
        }

        res.json({ success: true, data: results, query: q, area, amenity });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
