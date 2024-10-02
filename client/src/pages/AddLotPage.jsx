import { useState, useEffect } from "react";
import api from "../api";
import "../assets/css/add.css";
import { toast } from "react-toastify";

export default function AddLot() {
  const [possibleCategories, setPossibleCategories] = useState([]);
  const [possibleStates, setPossibleStates] = useState([]);

  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const res = await api.get("/lots/categories-state");
        setPossibleCategories(res.data.categories);
        setPossibleStates(res.data.states);
      } catch (e) {
        toast.error(e.response?.data?.message || "An error occurred");
      }
    })();
  }, []);

  const handleCategoryChange = (category) => {
    setCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  async function handleSubmit() {
    try {
      await api.post("/lots/add", {
        name,
        state,
        description,
        image,
        categories,
      });
      toast.success("Lot created!");

      setName("");
      setState("");
      setDescription("");
      setImage();
      setImagePreview(null);
      setCategories([]);
    } catch (e) {
      toast.error(e.response?.data?.message || "An error occurred");
    }
  }

  return (
    <div className="add">
      <div className="name-state-img">
        <div className="img">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Selected" />
            </div>
          )}
        </div>
        <div className="name-state-description">
          <input
            type="text"
            placeholder="Lot Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          >
            <option value="" disabled>
              Select State
            </option>
            {possibleStates.map((st, i) => (
              <option key={i} value={st}>
                {st}
              </option>
            ))}
          </select>{" "}
          <div className="descr">
            <textarea
              placeholder="Lot Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="add-category">
        <label>Select Categories</label>
        <div className="categories">
          {possibleCategories.map((category, i) => (
            <div
              key={i}
              className={`category-checkbox ${
                categories.includes(category) && " checked"
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      <input
        type="submit"
        value="Create lot"
        className="btn"
        onClick={handleSubmit}
      />
    </div>
  );
}
