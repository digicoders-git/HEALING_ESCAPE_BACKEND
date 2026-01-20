import Hospital from "../model/hospital.model.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   CREATE HOSPITAL
========================= */
export const createHospital = async (req, res) => {
  try {
    const {
      name,
      city,
      accreditations,
      specialities,
      about,
      description,
      departments,
      infrastructure,
      whyChoose,
      internationalServices
    } = req.body;

    if (!name || !city || !about || !description) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const exist = await Hospital.findOne({ name });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Hospital already exists"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "hospitals"
    });

    const hospital = await Hospital.create({
      name,
      city,
      image: upload.secure_url,
      imagePublicId: upload.public_id,
      accreditations: JSON.parse(accreditations),
      specialities: JSON.parse(specialities),
      about,
      description,
      departments: JSON.parse(departments),
      infrastructure: JSON.parse(infrastructure),
      whyChoose: JSON.parse(whyChoose),
      internationalServices: JSON.parse(internationalServices)
    });

    return res.status(201).json({
      success: true,
      message: "Hospital created successfully",
      hospital
    });
  } catch (error) {
    console.error("Create hospital error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getAllHospitals = async (req, res) => {
  try {
    const {
      search,
      city,
      speciality,
      accreditation,
      isActive,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // 🔎 GLOBAL SEARCH (single search box)
    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { about: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },

        { specialities: { $regex: search, $options: "i" } },
        { accreditations: { $regex: search, $options: "i" } },
        { departments: { $regex: search, $options: "i" } },
        { infrastructure: { $regex: search, $options: "i" } },
        { whyChoose: { $regex: search, $options: "i" } },
        { internationalServices: { $regex: search, $options: "i" } }
      ];
    }

    // 🏙️ City filter
    if (city && city !== "All") {
      query.city = city;
    }

    // 🏥 Speciality filter
    if (speciality && speciality !== "All") {
      query.specialities = { $in: [speciality] };
    }

    // 🏅 Accreditation filter
    if (accreditation && accreditation !== "All") {
      query.accreditations = { $in: [accreditation] };
    }

    // 🟢 Active / Inactive filter
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    // 📄 Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // 🔢 Total
    const total = await Hospital.countDocuments(query);

    // 📦 Data
    const hospitals = await Hospital.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      hospitals
    });
  } catch (error) {
    console.error("Get hospitals error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


/* =========================
   GET SINGLE
========================= */
export const getSingleHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found"
      });
    }

    return res.status(200).json({
      success: true,
      hospital
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid ID"
    });
  }
};

/* =========================
   UPDATE HOSPITAL (FULL)
========================= */
export const updateHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found"
      });
    }

    const fields = ["name", "city", "about", "description", "isActive"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        hospital[field] = req.body[field];
      }
    });

    if (req.body.accreditations) hospital.accreditations = JSON.parse(req.body.accreditations);
    if (req.body.specialities) hospital.specialities = JSON.parse(req.body.specialities);
    if (req.body.departments) hospital.departments = JSON.parse(req.body.departments);
    if (req.body.infrastructure) hospital.infrastructure = JSON.parse(req.body.infrastructure);
    if (req.body.whyChoose) hospital.whyChoose = JSON.parse(req.body.whyChoose);
    if (req.body.internationalServices) hospital.internationalServices = JSON.parse(req.body.internationalServices);

    // 🔁 Image update
    if (req.file) {
      if (hospital.imagePublicId) {
        await cloudinary.uploader.destroy(hospital.imagePublicId);
      }

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "hospitals"
      });

      hospital.image = upload.secure_url;
      hospital.imagePublicId = upload.public_id;
    }

    await hospital.save();

    return res.status(200).json({
      success: true,
      message: "Hospital updated successfully",
      hospital
    });
  } catch (error) {
    console.error("Update hospital error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   TOGGLE STATUS
========================= */
export const toggleHospitalStatus = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found"
      });
    }

    hospital.isActive = !hospital.isActive;
    await hospital.save();

    return res.status(200).json({
      success: true,
      message: `Hospital ${hospital.isActive ? "Activated" : "Deactivated"}`,
      isActive: hospital.isActive
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   DELETE HOSPITAL
========================= */
export const deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found"
      });
    }

    if (hospital.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(hospital.imagePublicId);
      } catch (err) {
        console.error("Cloudinary delete failed:", err.message);
      }
    }

    await hospital.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Hospital deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// GET /api/hospitals/dropdown
export const getHospitalsForDropdown = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isActive: true })
      .select("name city accreditations");

    return res.status(200).json({
      success: true,
      hospitals
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
