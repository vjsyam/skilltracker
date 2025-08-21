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
        
        setReportData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports");
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
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };

  if (loading) {
    return <div className="page glass"><h2>Loading reports...</h2></div>;
  }

  if (error) {
    return <div className="page glass"><h2>Error: {error}</h2></div>;
  }

  if (!reportData) {
    return <div className="page glass"><h2>No report data available</h2></div>;
  }

  const employeesPerDept = reportData.employeesPerDepartment || {};
  const skillsCount = reportData.skillsCount || {};

  const departmentNames = Object.keys(employeesPerDept);
  const departmentEmployeeCounts = Object.values(employeesPerDept);

  const skillNames = Object.keys(skillsCount);
  const skillCounts = Object.values(skillsCount);

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
      <div className="page-header">
        <h1>Reports & Analytics</h1>
      </div>

      <div className="charts-grid">
        {departmentNames.length > 0 && departmentSkillData && (
          <div className="chart-card">
            <div className="chart-title">
              <h2><FaChartBar /> Employees per Department</h2>
            </div>
            <div className="chart-container">
              <Bar 
                data={departmentSkillData} 
                options={chartOptions}
              />
            </div>
          </div>
        )}

        {skillNames.length > 0 && skillDistributionData && (
          <div className="chart-card">
            <div className="chart-title">
              <h2><FaChartPie /> Skill Distribution</h2>
            </div>
            <div className="chart-container">
              <Pie 
                data={skillDistributionData} 
                options={pieOptions}
              />
            </div>
          </div>
        )}

        {departmentNames.length === 0 && skillNames.length === 0 && (
          <div className="alert info">
            No data available for reports
          </div>
        )}
      </div>
    </div>
  );
}