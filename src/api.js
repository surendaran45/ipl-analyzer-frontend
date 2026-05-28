import axios from 'axios'

const BASE = 'https://ipl-analyzer-backend.onrender.com'

export const getTeams         = () => axios.get(`${BASE}/teams`)
export const getTeamStats     = (team) => axios.get(`${BASE}/team/${encodeURIComponent(team)}`)
export const getH2H           = (t1, t2) => axios.get(`${BASE}/h2h?team1=${encodeURIComponent(t1)}&team2=${encodeURIComponent(t2)}`)
export const getVenues        = () => axios.get(`${BASE}/venues`)
export const getWinProb       = (data) => axios.post(`${BASE}/win-probability`, data)
export const getPlayers       = () => axios.get(`${BASE}/players`)
export const getPlayerStats   = (name) => axios.get(`${BASE}/player/${encodeURIComponent(name)}`)
export const getPlayerSeasons = (name) => axios.get(`${BASE}/player/${encodeURIComponent(name)}/seasons`)
export const getSeasons       = () => axios.get(`${BASE}/seasons`)
export const getSeasonStats   = (s) => axios.get(`${BASE}/season/${s}`)