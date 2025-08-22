import React, { useEffect, useState } from "react";
import { getReports } from "../services/reportsService";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import "../styles/pages.css";
import "../styles/components.css";
import { FaChartBar, FaChartPie } from "react-icons/fa";
import FloatingParticles from "../components/FloatingParticles";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getReports();
        
        // Handle different response structures
        let data = null;
        if (response && response.data) {
          data = response.data;
        } else if (response && response.content) {
          data = response.content;
        } else if (response) {
          data = response;
        }
        
        // Ensure data has the expected structure
        if (data) {
          // Initialize empty objects if properties don't exist
          data.employeesPerDepartment = data.employeesPerDepartment || {};
          data.skillsCount = data.skillsCount || {};
        }
        
        console.log("Reports data:", data); // Debug log
        setReportData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports. Please try again later.");
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#1b3c53',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(27, 60, 83, 0.9)',
        titleColor: 'white',
        bodyColor: 'white'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(27, 60, 83, 0.1)'
        },
        ticks: {
          color: '#1b3c53'
        }
      },
      x: {
        grid: {
          color: 'rgba(27, 60, 83, 0.1)'
        },
        ticks: {
          color: '#1b3c53'
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#1b3c53',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(27, 60, 83, 0.9)',
        titleColor: 'white',
        bodyColor: 'white'
      }
    }
  };

  if (loading) {
    return (
      <div className="page glass">
        <div className="page-header">
          <div>
            <h1>Reports & Analytics</h1>
            <p className="page-subtitle">Loading your data...</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
          <h2>Loading reports...</h2>
          <p>Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page glass">
        <div className="page-header">
          <div>
            <h1>Reports & Analytics</h1>
            <p className="page-subtitle">Something went wrong</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          <h2>Error Loading Reports</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: '#FF6B6B',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return <div className="page glass"><h2>No report data available</h2></div>;
  }

  const employeesPerDept = reportData.employeesPerDepartment || {};
  const skillsCount = reportData.skillsCount || {};

  const departmentNames = Object.keys(employeesPerDept).filter(key => employeesPerDept[key] > 0);
  const departmentEmployeeCounts = departmentNames.map(key => employeesPerDept[key]);

  const skillNames = Object.keys(skillsCount).filter(key => skillsCount[key] > 0);
  const skillCounts = skillNames.map(key => skillsCount[key]);

  const departmentSkillData = departmentNames.length > 0 ? {
    labels: departmentNames,
    datasets: [
      {
        label: "Employees per Department",
        data: departmentEmployeeCounts,
        backgroundColor: "rgba(27, 60, 83, 0.7)",
        borderColor: "rgba(27, 60, 83, 1)",
        borderWidth: 1
      }
    ]
  } : null;

  const skillDistributionData = skillNames.length > 0 ? {
    labels: skillNames,
    datasets: [
      {
        label: "Skill Count",
        data: skillCounts,
        backgroundColor: [
          "rgba(27, 60, 83, 0.7)",
          "rgba(69, 104, 130, 0.7)",
          "rgba(210, 193, 182, 0.7)",
          "rgba(249, 243, 239, 0.7)",
          "rgba(150, 170, 190, 0.7)"
        ],
        borderColor: [
          "rgba(27, 60, 83, 1)",
          "rgba(69, 104, 130, 1)",
          "rgba(210, 193, 182, 1)",
          "rgba(249, 243, 239, 1)",
          "rgba(150, 170, 190, 1)"
        ],
        borderWidth: 1
      }
    ]
  } : null;

  return (
    <div className="page glass">
      <FloatingParticles />
      <div className="page-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="page-subtitle">Visualize department sizes and skill distribution</p>
        </div>
      </div>

      <div className="charts-grid">
        {departmentNames.length > 0 && departmentSkillData && (
          <div className="alt-card hover-lift">
            <div className="chart-title">
              <h2><FaChartBar /> Employees per Department</h2>
            </div>
            <div className="soft-divider" />
            <div className="chart-container" style={{ height: '300px', width: '100%' }}>
              <Bar 
                data={departmentSkillData} 
                options={chartOptions}
              />
            </div>
          </div>
        )}

        {skillNames.length > 0 && skillDistributionData && (
          <div className="alt-card hover-lift">
            <div className="chart-title">
              <h2><FaChartPie /> Skill Distribution</h2>
            </div>
            <div className="soft-divider" />
            <div className="chart-container" style={{ height: '300px', width: '100%' }}>
              <Pie 
                data={skillDistributionData} 
                options={pieOptions}
              />
            </div>
          </div>
        )}

        {departmentNames.length === 0 && skillNames.length === 0 && (
          <div className="alt-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h2>No Data Available</h2>
            <p>There's no data available for reports at the moment.</p>
            <p style={{ marginTop: '1rem', opacity: 0.7 }}>
              Please ensure you have employees and skills data in the system.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}