import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://ipl-analyzer-backend.onrender.com'

export const getTeams         = () => axios.get(`${API_BASE}/teams`)
export const getTeamStats     = (team) => axios.get(`${API_BASE}/team/${encodeURIComponent(team)}`)
export const getH2H           = (t1, t2) => axios.get(`${API_BASE}/h2h?team1=${encodeURIComponent(t1)}&team2=${encodeURIComponent(t2)}`)
export const getVenues        = () => axios.get(`${API_BASE}/venues`)
export const getWinProb       = (data) => axios.post(`${API_BASE}/win-probability`, data)
export const getPlayers       = () => axios.get(`${API_BASE}/players`)
export const getPlayerStats   = (name) => axios.get(`${API_BASE}/player/${encodeURIComponent(name)}`)
export const getPlayerSeasons = (name) => axios.get(`${API_BASE}/player/${encodeURIComponent(name)}/seasons`)
export const getSeasons       = () => axios.get(`${API_BASE}/seasons`)
export const getSeasonStats   = (s) => axios.get(`${API_BASE}/season/${s}`)