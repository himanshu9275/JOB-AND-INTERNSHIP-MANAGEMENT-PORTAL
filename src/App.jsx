import { useState, useEffect } from "react";
import "./App.css";
import jobs from "./data/jobs.json";
import internships from "./data/internships.json";


function App() {
  const [jobList, setJobList] = useState(() => {
  return JSON.parse(localStorage.getItem("jobList")) || jobs;
});

const [internshipList, setInternshipList] = useState(() => {
  return JSON.parse(localStorage.getItem("internshipList")) || internships;
});

useEffect(() => {
  localStorage.setItem("jobList", JSON.stringify(jobList));
}, [jobList]);

useEffect(() => {
  localStorage.setItem("internshipList", JSON.stringify(internshipList));
}, [internshipList]);

  const [page, setPage] = useState("Home");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [sortBy, setSortBy] = useState("Default");
  const [showPostForm, setShowPostForm] = useState(false);

const [newOpportunity, setNewOpportunity] = useState({
  title: "",
  company: "",
  location: "",
  type: "Full Time",
  category: "IT",
  description: "",
});
  const [applications, setApplications] = useState(() => {
    return JSON.parse(localStorage.getItem("applications")) || [];
  });
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    resume: "",
    coverLetter: "",
  });

useEffect(() => {
  localStorage.setItem("applications", JSON.stringify(applications));
}, [applications]);
  const data = page === "Jobs" ? jobList : internshipList;
  const filteredData = data
  .filter((item) => {
    const matchesSearch =
      `${item.title} ${item.company} ${item.location} ${item.category}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || item.category === category;

    const matchesLocation =
      location === "All" || item.location === location;

    const matchesType =
      jobType === "All" || item.type === jobType;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLocation &&
      matchesType
    );
  })
  .sort((a, b) => {
    if (sortBy === "Title A-Z") {
      return a.title.localeCompare(b.title);
    }

    if (sortBy === "Company A-Z") {
      return a.company.localeCompare(b.company);
    }

    return 0;
  });

  const apply = (item) => {
  setSelectedOpportunity(item);
  setForm({
    name: "",
    email: "",
    phone: "",
    resume: "",
    coverLetter: "",
  });
  setPage("Apply");
};

const submitApplication = (e) => {
  e.preventDefault();

  const newApplication = {
    ...selectedOpportunity,
    ...form,
    status: "Applied",
    appliedOn: new Date().toLocaleDateString(),
  };

  setApplications([...applications, newApplication]);
  setSelectedOpportunity(null);
  setPage("Applications");
  alert("Application submitted successfully!");
};
const updateApplicationStatus = (id, status) => {
  setApplications(
    applications.map((app) =>
      app.id === id ? { ...app, status } : app
    )
  );
};
const postOpportunity = (e) => {
  e.preventDefault();

  const opportunity = {
    ...newOpportunity,
    id: Date.now(),
    type: newOpportunity.type,
  };

  if (newOpportunity.type === "Internship") {
    setInternshipList([...internshipList, opportunity]);
  } else {
    setJobList([...jobList, opportunity]);
  }

  setNewOpportunity({
    title: "",
    company: "",
    location: "",
    type: "Full Time",
    category: "IT",
    description: "",
  });

  setShowPostForm(false);
  setPage(newOpportunity.type === "Internship" ? "Internships" : "Jobs");
  alert("Opportunity posted successfully!");
};
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <span>X</span> InternX
        </div>

        <nav>
          {["Home", "Jobs", "Internships", "Applications", "Dashboard"].map(
            (item) => (
              <button
                key={item}
                className={page === item ? "active" : ""}
                onClick={() => {
                  setPage(item);
                  setSearch("");
                }}
              >
                {item}
              </button>
            )
          )}
        </nav>

        <button className="login-btn">Login</button>
      </header>

      {page === "Home" && (
        <main>
          <section className="hero">
            <div>
              <p className="tag">JOB & INTERNSHIP MANAGEMENT PORTAL</p>
              <h1>
                Find Your Next
                <span> Opportunity</span>
              </h1>
              <p className="hero-text">
                Discover jobs and internships, apply easily, and track your
                applications in one place.
              </p>

              <div className="hero-buttons">
                <button onClick={() => setPage("Jobs")}>Explore Jobs</button>
                <button
                  className="secondary"
                  onClick={() => setPage("Internships")}
                >
                  Find Internships
                </button>
              </div>
            </div>

            <div className="hero-card">
              <div className="circle">💼</div>
              <h3>Build Your Career</h3>
              <p>Search. Apply. Track. Grow.</p>
            </div>
          </section>

          <section className="stats">
            <div>
              <strong>{jobs.length}+</strong>
              <span>Jobs</span>
            </div>
            <div>
              <strong>{internships.length}+</strong>
              <span>Internships</span>
            </div>
            <div>
              <strong>{applications.length}</strong>
              <span>Applications</span>
            </div>
          </section>

          <section className="section">
            <h2>Why Use InternX?</h2>
            <div className="features">
              <div className="feature-card">
                <div>🔎</div>
                <h3>Search & Filter</h3>
                <p>Find opportunities by category, location and type.</p>
              </div>

              <div className="feature-card">
                <div>📝</div>
                <h3>Easy Application</h3>
                <p>Apply to opportunities through a simple application flow.</p>
              </div>

              <div className="feature-card">
                <div>📊</div>
                <h3>Track Applications</h3>
                <p>Keep track of your submitted job and internship applications.</p>
              </div>
            </div>
          </section>
        </main>
      )}

      {(page === "Jobs" || page === "Internships") && (
        <main className="page">
          <div className="page-heading">
            <div>
              <p className="tag">{page.toUpperCase()}</p>
              <h1>{page === "Jobs" ? "Find Your Dream Job" : "Explore Internships"}</h1>
            </div>

            <input
              className="search"
              type="text"
              placeholder="Search by title, company, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="filters">
  <select value={category} onChange={(e) => setCategory(e.target.value)}>
    <option value="All">All Categories</option>
    <option value="IT">IT</option>
    <option value="HR">HR</option>
    <option value="Cybersecurity">Cybersecurity</option>
    <option value="Marketing">Marketing</option>
  </select>

  <select value={location} onChange={(e) => setLocation(e.target.value)}>
    <option value="All">All Locations</option>
    <option value="Noida">Noida</option>
    <option value="Delhi">Delhi</option>
    <option value="Bangalore">Bangalore</option>
    <option value="Remote">Remote</option>
  </select>

  <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
    <option value="All">All Types</option>
    <option value="Full Time">Full Time</option>
    <option value="Internship">Internship</option>
  </select>
  <div className="form-group">
  <label>Sort By</label>
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
  >
    <option value="Default">Default</option>
    <option value="Title A-Z">Title A-Z</option>
    <option value="Company A-Z">Company A-Z</option>
  </select>
</div>

  <button
    className="clear-filter"
    onClick={() => {
      setSearch("");
      setCategory("All");
      setLocation("All");
      setJobType("All");
      setSortBy("Default");
    }}
  >
    Clear Filters
  </button>
</div>
          </div>

          <div className="cards">
            {filteredData.map((item) => (
              <div className="opportunity-card" key={item.id}>
                <div className="company-icon">
                  {item.company.charAt(0)}
                </div>

                <div className="card-content">
                  <h3>{item.title}</h3>
                  <p className="company">{item.company}</p>

                  <div className="details">
                    <span>📍 {item.location}</span>
                    <span>💼 {item.type}</span>
                    <span>🏷️ {item.category}</span>
                  </div>

                  <button onClick={() => apply(item)}>Apply Now</button>
                </div>
              </div>
            ))}

            {filteredData.length === 0 && (
              <p className="empty">No opportunities found.</p>
            )}
          </div>
        </main>
      )}

      {page === "Apply" && (
  <main className="page">
    <p className="tag">APPLICATION FORM</p>
    <h1>Apply for {selectedOpportunity?.title}</h1>

    <form className="application-form" onSubmit={submitApplication}>
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Enter your full name"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Resume</label>
        <input
          type="text"
          required
          value={form.resume}
          onChange={(e) => setForm({ ...form, resume: e.target.value })}
          placeholder="Enter resume file name or link"
        />
      </div>

      <div className="form-group">
        <label>Cover Letter</label>
        <textarea
          required
          rows="6"
          value={form.coverLetter}
          onChange={(e) =>
            setForm({ ...form, coverLetter: e.target.value })
          }
          placeholder="Write your cover letter..."
        />
      </div>

      <div className="form-actions">
        <button type="submit">Submit Application</button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => setPage("Jobs")}
        >
          Cancel
        </button>
      </div>
    </form>
  </main>
)}

      {page === "Applications" && (
        <main className="page">
          <p className="tag">APPLICATIONS</p>
          <h1>My Applications</h1>

          {applications.length === 0 ? (
            <div className="empty-box">
              <div>📄</div>
              <h3>No Applications Yet</h3>
              <p>Apply for a job or internship to see it here.</p>
              <button onClick={() => setPage("Jobs")}>Browse Jobs</button>
            </div>
          ) : (
            <div className="application-list">
              {applications.map((app, index) => (
                <div className="application-card" key={index}>
                  <div>
                    <h3>{app.title}</h3>
                    <p>{app.company}</p>
                    <span>📍 {app.location}</span>
                  </div>
                  <select
                  value={app.status}
                  onChange={(e) =>
    updateApplicationStatus(app.id, e.target.value)
  }
>
  <option value="Applied">Applied</option>
  <option value="Under Review">Under Review</option>
  <option value="Selected">Selected</option>
  <option value="Rejected">Rejected</option>
</select>
                </div>
              ))}
            </div>
          )}
        </main>
      )}
    {page === "Dashboard" && (
  <main className="page">
    <p className="tag">DASHBOARD</p>
    <h1>Welcome to Your Dashboard</h1>
    <button
  className="post-btn"
  onClick={() => setShowPostForm(true)}
>
  + Post New Opportunity
</button>

    <div className="dashboard-grid">
      <div className="dashboard-card">
        <span>Available Jobs</span>
        <strong>{jobList.length}</strong>
      </div>

      <div className="dashboard-card">
        <span>Internships</span>
        <strong>{internshipList.length}</strong>
      </div>

      <div className="dashboard-card">
        <span>Total Applications</span>
        <strong>{applications.length}</strong>
      </div>

      <div className="dashboard-card">
        <span>Selected</span>
        <strong>
          {applications.filter((app) => app.status === "Selected").length}
        </strong>
      </div>

      <div className="dashboard-card">
        <span>Under Review</span>
        <strong>
          {applications.filter((app) => app.status === "Under Review").length}
        </strong>
      </div>

      <div className="dashboard-card">
        <span>Rejected</span>
        <strong>
          {applications.filter((app) => app.status === "Rejected").length}
        </strong>
      </div>
    </div>

    <div className="dashboard-message">
      <h2>Manage Your Career Journey</h2>
      <p>
        Browse opportunities, submit applications and track your
        application history from your dashboard.
      </p>
    </div>

    {applications.length > 0 && (
      <div className="dashboard-message">
        <h2>Recent Applications</h2>

        {applications.slice(-3).reverse().map((app) => (
          <div className="application-row" key={app.id}>
            <strong>{app.name}</strong>
            <span>{app.email}</span>
            <span>{app.status || "Applied"}</span>
          </div>
        ))}
      </div>
    )}
    {showPostForm && (
  <form className="application-form" onSubmit={postOpportunity}>
    <h2>Post New Opportunity</h2>

    <div className="form-group">
      <label>Title</label>
      <input
        type="text"
        required
        value={newOpportunity.title}
        onChange={(e) =>
          setNewOpportunity({
            ...newOpportunity,
            title: e.target.value,
          })
        }
        placeholder="e.g. React Developer"
      />
    </div>

    <div className="form-group">
      <label>Company</label>
      <input
        type="text"
        required
        value={newOpportunity.company}
        onChange={(e) =>
          setNewOpportunity({
            ...newOpportunity,
            company: e.target.value,
          })
        }
        placeholder="Company name"
      />
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          required
          value={newOpportunity.location}
          onChange={(e) =>
            setNewOpportunity({
              ...newOpportunity,
              location: e.target.value,
            })
          }
          placeholder="Delhi / Noida / Remote"
        />
      </div>

      <div className="form-group">
        <label>Type</label>
        <select
          value={newOpportunity.type}
          onChange={(e) =>
            setNewOpportunity({
              ...newOpportunity,
              type: e.target.value,
            })
          }
        >
          <option>Full Time</option>
          <option>Internship</option>
        </select>
      </div>
    </div>

    <div className="form-group">
      <label>Category</label>
      <select
        value={newOpportunity.category}
        onChange={(e) =>
          setNewOpportunity({
            ...newOpportunity,
            category: e.target.value,
          })
        }
      >
        <option>IT</option>
        <option>HR</option>
        <option>Cybersecurity</option>
        <option>Marketing</option>
      </select>
    </div>

    <div className="form-group">
      <label>Description</label>
      <textarea
        rows="5"
        value={newOpportunity.description}
        onChange={(e) =>
          setNewOpportunity({
            ...newOpportunity,
            description: e.target.value,
          })
        }
        placeholder="Describe the opportunity..."
      />
    </div>

    <div className="form-actions">
      <button type="submit">Post Opportunity</button>

      <button
        type="button"
        className="cancel-btn"
        onClick={() => setShowPostForm(false)}
      >
        Cancel
      </button>
    </div>
  </form>
)}
  </main>
)}

      <footer>
        <p>© 2026 Job & Internship Management Portal</p>
        <p>Built with React</p>
      </footer>
    </div>
  );
}

export default App;