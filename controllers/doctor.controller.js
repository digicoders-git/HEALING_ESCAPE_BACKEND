import Doctor from "../model/doctor.model.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   CREATE DOCTOR
========================= */
export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      speciality,
      qualification,
      designation,
      experience,
      hospital,
      summary,
      about,
      expertise,
      procedures,
      whyChoose
    } = req.body;

    // ✅ Only these 3 fields required from body
    if (!name || !speciality || !experience) {
      return res.status(400).json({
        success: false,
        message: "Doctor name, speciality and experience are required"
      });
    }

    // ✅ Photo required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Doctor photo is required"
      });
    }

    // ⬆️ Upload to cloudinary
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "doctors"
    });

    const doctor = await Doctor.create({
      name,
      photo: upload.secure_url,
      photoPublicId: upload.public_id,
      speciality,
      qualification: qualification || "",
      designation: designation || "",
      experience: Number(experience),
      hospital: hospital ? JSON.parse(hospital) : [],
      summary: summary || "",
      about: about || "",
      expertise: expertise ? JSON.parse(expertise) : [],
      procedures: procedures ? JSON.parse(procedures) : [],
      whyChoose: whyChoose ? JSON.parse(whyChoose) : []
    });

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      doctor
    });
  } catch (error) {
    console.error("Create doctor error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const {
      search,
      speciality,
      city,
      hospital,
      isActive,
      page = 1,
      limit = 1000000
    } = req.query;

    const query = {};

    // 🔎 GLOBAL SEARCH (single box)
    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { speciality: { $regex: search, $options: "i" } },
        { "hospital.name": { $regex: search, $options: "i" } },
        { "hospital.city": { $regex: search, $options: "i" } }
      ];
    }

    // 🧠 Speciality dropdown filter
    if (speciality && speciality !== "All") {
      query.speciality = speciality;
    }

    // 🏙️ City filter (optional)
    if (city && city !== "All") {
      query["hospital.city"] = city;
    }

    // 🏥 Hospital filter (optional)
    if (hospital && hospital !== "All") {
      query["hospital.name"] = hospital;
    }

    // 🟢 Active / Inactive
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    // 📄 Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // 🔢 Total
    const total = await Doctor.countDocuments(query);

    // 📦 Data
    const doctors = await Doctor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      doctors
    });
  } catch (error) {
    console.error("Get doctors error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


/* =========================
   GET SINGLE
========================= */
export const getSingleDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    return res.status(200).json({
      success: true,
      doctor
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid ID"
    });
  }
};

/* =========================
   UPDATE DOCTOR (FULL)
========================= */
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    const fields = [
      "name",
      "speciality",
      "qualification",
      "designation",
      "experience",
      "summary",
      "about",
      "isActive"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        doctor[field] = field === "experience" ? Number(req.body[field]) : req.body[field];
      }
    });

    if (req.body.hospital) doctor.hospital = JSON.parse(req.body.hospital);
    if (req.body.expertise) doctor.expertise = JSON.parse(req.body.expertise);
    if (req.body.procedures) doctor.procedures = JSON.parse(req.body.procedures);
    if (req.body.whyChoose) doctor.whyChoose = JSON.parse(req.body.whyChoose);

    // 🔁 Photo update
    if (req.file) {
      if (doctor.photoPublicId) {
        await cloudinary.uploader.destroy(doctor.photoPublicId);
      }

      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "doctors"
      });

      doctor.photo = upload.secure_url;
      doctor.photoPublicId = upload.public_id;
    }

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor
    });
  } catch (error) {
    console.error("Update doctor error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

/* =========================
   TOGGLE STATUS
========================= */
export const toggleDoctorStatus = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    doctor.isActive = !doctor.isActive;
    await doctor.save();

    return res.status(200).json({
      success: true,
      message: `Doctor ${doctor.isActive ? "Activated" : "Deactivated"}`,
      isActive: doctor.isActive
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* =========================
   DELETE DOCTOR
========================= */
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // 🔥 Delete photo from cloudinary
    if (doctor.photoPublicId) {
      try {
        await cloudinary.uploader.destroy(doctor.photoPublicId);
      } catch (err) {
        console.error("Cloudinary delete failed:", err.message);
      }
    }

    await doctor.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


/* =========================
   GET SPECIALITIES FOR DOCTOR DROPDOWN
========================= */
export const getDoctorSpecialitiesDropdown = async (req, res) => {
  try {
    const specialities = await Doctor.distinct("speciality", { isActive: true });

    return res.status(200).json({
      success: true,
      specialities
    });
  } catch (error) {
    console.error("Get doctor specialities dropdown error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
