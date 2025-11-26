import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Watch from './pages/Watch';
import Upload from './pages/Upload';
import Trending from './pages/Trending';
import Subscriptions from './pages/Subscriptions';
import Search from './pages/Search';
import Channel from './pages/Channel';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <div className="app-body">
            <Sidebar isOpen={sidebarOpen} />
            <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/watch/:id" element={<Watch />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/search" element={<Search />} />
                <Route path="/channel/:id" element={<Channel />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
