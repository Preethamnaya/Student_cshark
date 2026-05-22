import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, XCircle, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setStudents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/approve`);
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      if(window.confirm('Are you sure you want to reject and delete this user?')){
         await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
         fetchStudents();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <button onClick={logout} className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-700">Student Approvals</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {students.length === 0 ? (
              <p className="p-6 text-slate-500 text-center">No students found.</p>
            ) : (
              students.map(student => (
                <div key={student._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">{student.name}</h3>
                    <p className="text-sm text-slate-500">{student.email}</p>
                    <span className={`inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {student.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {student.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleApprove(student._id)}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                      </button>
                      <button 
                        onClick={() => handleReject(student._id)}
                        className="flex items-center px-4 py-2 bg-white border border-red-200 text-red-600 rounded hover:bg-red-50 transition shadow-sm"
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
