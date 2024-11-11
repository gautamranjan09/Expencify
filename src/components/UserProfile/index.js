import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./style.css";
import { toast } from "react-toastify";
import {
  User,
  Building2,
  BadgeCheck,
  MapPin,
  Phone,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { DotLoader } from "react-spinners";

const UserProfile = () => {
  const [user] = useAuthState(auth);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
    location: "",
    phone: "",
    bio: "",
    photoURL: "",
  });

  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user?.uid) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfileData({
          name: user.displayName || data.name || "",
          email: user.email || data.email || "",
          department: data.department || "",
          role: data.role || "",
          location: data.location || "",
          phone: data.phone || "",
          bio: data.bio || "",
          photoURL: user.photoURL || data.photoURL || "",
        });
        setEditedData({
          department: data.department || "",
          role: data.role || "",
          location: data.location || "",
          phone: data.phone || "",
          bio: data.bio || "",
        });
      }
    } catch (error) {
      toast.error("Error fetching profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.uid) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...editedData,
        lastUpdated: new Date(),
        isProfileComplete: Boolean(
          editedData.department &&
            editedData.role &&
            editedData.location &&
            editedData.phone
        ),
      });

      setProfileData((prev) => ({
        ...prev,
        ...editedData,
      }));

      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="loader-wrapper">
        <DotLoader color="#2970ff" />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image-container">
          <img
            src={profileData.photoURL || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-image"
          />
        </div>
        <div className="profile-title">
          <h1>{profileData.name}</h1>
          <p>{profileData.email}</p>
        </div>
        {!isEditing ? (
          <Edit2 className="edit-icon" onClick={() => setIsEditing(true)} />
        ) : (
          <div className="edit-controls">
            <Save className="save-icon" onClick={handleSave} />
            <X
              className="cancel-icon"
              onClick={() => {
                setIsEditing(false);
                setEditedData(profileData);
              }}
            />
          </div>
        )}
      </div>

      <div className="profile-details">
        <div className="profile-field">
          <Building2 className="field-icon" />
          {isEditing ? (
            <input
              type="text"
              name="department"
              value={editedData.department}
              onChange={handleInputChange}
              placeholder="Enter department"
              className="edit-input"
            />
          ) : (
            <div className="field-content">
              <label>Department</label>
              <p>{profileData.department || "Not specified"}</p>
            </div>
          )}
        </div>

        <div className="profile-field">
          <BadgeCheck className="field-icon" />
          {isEditing ? (
            <input
              type="text"
              name="role"
              value={editedData.role}
              onChange={handleInputChange}
              placeholder="Enter role"
              className="edit-input"
            />
          ) : (
            <div className="field-content">
              <label>Role</label>
              <p>{profileData.role || "Not specified"}</p>
            </div>
          )}
        </div>

        <div className="profile-field">
          <MapPin className="field-icon" />
          {isEditing ? (
            <input
              type="text"
              name="location"
              value={editedData.location}
              onChange={handleInputChange}
              placeholder="Enter location"
              className="edit-input"
            />
          ) : (
            <div className="field-content">
              <label>Location</label>
              <p>{profileData.location || "Not specified"}</p>
            </div>
          )}
        </div>

        <div className="profile-field">
          <Phone className="field-icon" />
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={editedData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="edit-input"
            />
          ) : (
            <div className="field-content">
              <label>Phone</label>
              <p>{profileData.phone || "Not specified"}</p>
            </div>
          )}
        </div>

        <div className="profile-field full-width">
          <User className="field-icon" />
          {isEditing ? (
            <input
              name="photoURL"
              value={editedData.photoURL}
              onChange={handleInputChange}
              placeholder="Enter photoURL"
              className="edit-input"
            />
          ) : (
            <div className="field-content">
              <label>PhotoURL</label>
              <p>{profileData.photoURL || "Not specified"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
