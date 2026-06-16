import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import API from "../../services/api";

function EditGuide(){

  const navigate = useNavigate();
  const { id } = useParams();

  const [guideName,setGuideName] = useState("");
  const [languages,setLanguages] = useState("");
  const [experience,setExperience] = useState("");
  const [pricePerDay,setPricePerDay] = useState("");
  const [location,setLocation] = useState("");
  const [description,setDescription] = useState("");
  const [images,setImages] = useState([]);
  const [loading,setLoading] = useState(true);

  const fetchGuide = async()=>{
    try{
      const res = await API.get(`/guides/${id}`);
      const g = res.data;

      setGuideName(g.guideName);
      setLanguages(g.languages?.join(", "));
      setExperience(g.experience);
      setPricePerDay(g.pricePerDay);
      setLocation(g.location);
      setDescription(g.description);

    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{ if(id) fetchGuide(); },[id]);

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{

      if(images.length > 0){

        const formData = new FormData();

        formData.append("guideName", guideName);
        formData.append("languages", JSON.stringify(languages.split(",").map(l=>l.trim())));
        formData.append("experience", Number(experience));
        formData.append("pricePerDay", Number(pricePerDay));
        formData.append("location", location);
        formData.append("description", description);

        formData.append("role","tour_guide");

        for(let i=0;i<images.length;i++){
          formData.append("serviceImages", images[i]);
        }

        await API.put(`/guides/update/${id}`, formData);

      } else {

        await API.put(`/guides/update/${id}`,{
          guideName,
          languages: languages.split(",").map(l=>l.trim()),
          experience:Number(experience),
          pricePerDay:Number(pricePerDay),
          location,
          description
        });

      }

      alert("Updated");
      navigate("/guide-dashboard");

    }catch(err){
      console.error(err.response?.data || err);
    }
  };

  if(loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center text-lg font-semibold">
      Loading...
    </div>
  );

  return(

    <div className="min-h-screen bg-white flex justify-center items-center p-6">

      <div className="w-full max-w-2xl bg-white border rounded-2xl shadow-lg p-8">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          ✏️ Edit Guide
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* GUIDE NAME */}
          <div>
            <label className="text-sm text-gray-600">Guide Name</label>
            <input
              value={guideName}
              onChange={e=>setGuideName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* LANGUAGES */}
          <div>
            <label className="text-sm text-gray-600">Languages</label>
            <input
              value={languages}
              onChange={e=>setLanguages(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* EXPERIENCE */}
          <div>
            <label className="text-sm text-gray-600">Experience (Years)</label>
            <input
              value={experience}
              onChange={e=>setExperience(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="text-sm text-gray-600">Price Per Day</label>
            <input
              value={pricePerDay}
              onChange={e=>setPricePerDay(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="text-sm text-gray-600">Location</label>
            <input
              value={location}
              onChange={e=>setLocation(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              value={description}
              onChange={e=>setDescription(e.target.value)}
              className="w-full p-3 border rounded-lg h-28 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Update Images (optional)
            </label>

            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition">
              <span className="text-gray-500">Click to upload new images</span>
              <input
                type="file"
                multiple
                onChange={e=>setImages(e.target.files)}
                className="hidden"
              />
            </label>
          </div>

          {/* BUTTON */}
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Update Guide
          </button>

        </form>

      </div>

    </div>
  );
}

export default EditGuide;