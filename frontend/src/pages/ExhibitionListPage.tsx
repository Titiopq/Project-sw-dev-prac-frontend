import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

interface Exhibition {
  _id: string;
  name: string;
  description: string;
  venue: string;
  startDate: string;
  durationDay: number;
  smallBoothQuota: number;
  bigBoothQuota: number;
  posterPicture?: string;
}

export default function ExhibitionListPage() {
  const { isAdmin } = useAuth();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

  const load = async () => {
    const res = await api.get("/exhibitions");
    setExhibitions(res.data.data || res.data);
  };

  const remove = async (id: string) => {
    if (confirm("Delete this exhibition?")) {
      await api.delete(`/exhibitions/${id}`);
      load();
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="app-container">
      <h2 className="page-title">Exhibitions</h2>

      <div className="list">
        {exhibitions.map((ex) => (
          <div key={ex._id} className="card">
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              {ex.posterPicture ? (
                <img src={ex.posterPicture} alt={`${ex.name} poster`} className="exhibition-thumb" />
              ) : (
                <div className="exhibition-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', background: 'rgba(255,255,255,0.01)' }}>No image</div>
              )}

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{ex.name}</h3>
                <p className="muted" style={{ margin: '0.4rem 0' }}>{ex.venue} • {new Date(ex.startDate).toLocaleDateString()}</p>
                <p style={{ margin: '0.4rem 0' }}>{ex.description}</p>
                <p className="muted" style={{ marginBottom: '0.6rem' }}>Duration: {ex.durationDay} days — Small: {ex.smallBoothQuota} | Big: {ex.bigBoothQuota}</p>

                <div className="form-actions">
                  {isAdmin && (
                    <>
                      <Link to={`/exhibitions/${ex._id}/edit`} className="btn btn-outline">Edit</Link>
                      <button className="btn btn-outline" onClick={() => remove(ex._id)}>Delete</button>
                    </>
                  )}
                  <Link to={`/bookings/new`} className="btn btn-primary">Book Booth</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdmin && (
        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
          <Link to="/exhibitions/new" className="btn btn-primary">+ Add Exhibition</Link>
        </div>
      )}
    </div>
  );
}
