import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import dayjs from "dayjs";

interface ExhibitionForm {
  name: string;
  description: string;
  venue: string;
  startDate: string;
  durationDay: number;
  smallBoothQuota: number;
  bigBoothQuota: number;
  posterPicture: string;
}

export default function ExhibitionFormPage() {
  const [form, setForm] = useState<ExhibitionForm>({
    name: "",
    description: "",
    venue: "",
    startDate: "",
    durationDay: 1,
    smallBoothQuota: 0,
    bigBoothQuota: 0,
    posterPicture: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // Restrict upload size to 5 MB
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      alert('Selected file is too large. Please choose an image smaller than 5 MB.');
      e.currentTarget.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result is a data URL (base64)
      setForm((prev) => ({ ...prev, posterPicture: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Today's date in YYYY-MM-DD for `min` attribute
  const today = dayjs().format("YYYY-MM-DD");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent start date in the past
    if (form.startDate && dayjs(form.startDate).isBefore(dayjs(), 'day')) {
      alert('Start date cannot be in the past. Please select today or a future date.');
      return;
    }

    try {
      if (id) await api.put(`/exhibitions/${id}`, form);
      else await api.post("/exhibitions", form);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to save exhibition");
    }
  };

  useEffect(() => {
    if (id) {
      api.get(`/exhibitions/${id}`).then((res) => setForm(res.data.data || res.data));
    }
  }, [id]);

  return (
    <div className="app-container">
      <div className="card form-card">
        <h2 className="page-title">{id ? "Edit Exhibition" : "New Exhibition"}</h2>
        <form onSubmit={submit}>
          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input id="name" className="form-input" name="name" placeholder="Name" value={form.name} onChange={change} />
          </div>

          <div className="form-row">
            <label htmlFor="description">Description</label>
            <textarea id="description" className="form-input" rows={4} name="description" placeholder="Description" value={form.description} onChange={change} />
          </div>

          <div className="form-row">
            <label htmlFor="venue">Venue</label>
            <input id="venue" className="form-input" name="venue" placeholder="Venue" value={form.venue} onChange={change} />
          </div>

          <div className="form-row">
            <label htmlFor="startDate">Start Date</label>
            <input id="startDate" className="form-input" type="date" name="startDate" value={form.startDate?.slice(0, 10)} onChange={change} min={today} />
          </div>

          <div className="form-row">
            <label htmlFor="durationDay">Duration (days)</label>
            <input id="durationDay" className="form-input" type="number" name="durationDay" placeholder="Duration" value={form.durationDay} onChange={change} />
          </div>

          <div className="form-row">
            <label htmlFor="smallBoothQuota">Small Booth Quota</label>
            <input id="smallBoothQuota" className="form-input" type="number" name="smallBoothQuota" placeholder="Small booths" value={form.smallBoothQuota} onChange={change} />
          </div>

          <div className="form-row">
            <label htmlFor="bigBoothQuota">Big Booth Quota</label>
            <input id="bigBoothQuota" className="form-input" type="number" name="bigBoothQuota" placeholder="Big booths" value={form.bigBoothQuota} onChange={change} />
          </div>

          <div className="form-row">
            <label htmlFor="posterFile">Poster (upload from device)</label>
            <input id="posterFile" className="form-input" type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="form-row">
            <label htmlFor="posterPicture">Poster URL (or base64)</label>
            <input id="posterPicture" className="form-input" name="posterPicture" placeholder="Poster URL or base64" value={form.posterPicture} onChange={change} />
          </div>

          {form.posterPicture && (
            <div className="form-row">
              <label>Preview</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={form.posterPicture} alt="poster preview" style={{ maxWidth: 160, maxHeight: 160, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.04)' }} />
              </div>
            </div>
          )}

          <div className="form-actions">
            <button className="btn btn-primary" type="submit">{id ? "Save Changes" : "Create Exhibition"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
