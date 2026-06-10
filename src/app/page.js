'use client';

import React, { useState, useRef, useEffect } from 'react';
import { countries } from '@/data/countries';
import { toPng } from 'html-to-image';

export default function Home() {
  const [fullName, setFullName] = useState('');

  // Predictions state
  const [champion, setChampion] = useState('');
  const [championCode, setChampionCode] = useState('');
  const [runnerUp, setRunnerUp] = useState('');
  const [runnerUpCode, setRunnerUpCode] = useState('');
  const [thirdPlace, setThirdPlace] = useState('');
  const [thirdPlaceCode, setThirdPlaceCode] = useState('');

  const [team1Score, setTeam1Score] = useState('');
  const [team2Score, setTeam2Score] = useState('');
  const [topScorer, setTopScorer] = useState('');

  // Autocomplete states
  const [championQuery, setChampionQuery] = useState('');
  const [championSuggestions, setChampionSuggestions] = useState([]);
  const [showChampionSuggestions, setShowChampionSuggestions] = useState(false);

  const [runnerUpQuery, setRunnerUpQuery] = useState('');
  const [runnerUpSuggestions, setRunnerUpSuggestions] = useState([]);
  const [showRunnerUpSuggestions, setShowRunnerUpSuggestions] = useState(false);

  const [thirdPlaceQuery, setThirdPlaceQuery] = useState('');
  const [thirdPlaceSuggestions, setThirdPlaceSuggestions] = useState([]);
  const [showThirdPlaceSuggestions, setShowThirdPlaceSuggestions] = useState(false);

  // Form submission and download states
  const [toast, setToast] = useState(null);

  const ticketRef = useRef(null);

  // Filter country autocomplete suggestions
  const filterCountries = (query) => {
    if (!query) return [];
    return countries.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleChampionChange = (e) => {
    const val = e.target.value;
    setChampionQuery(val);
    setChampionSuggestions(filterCountries(val));
    setShowChampionSuggestions(true);
    // Clear selection if editing
    if (champion) {
      setChampion('');
      setChampionCode('');
    }
  };

  const selectChampion = (country) => {
    setChampion(country.name);
    setChampionCode(country.code);
    setChampionQuery(country.name);
    setShowChampionSuggestions(false);
  };

  const handleRunnerUpChange = (e) => {
    const val = e.target.value;
    setRunnerUpQuery(val);
    setRunnerUpSuggestions(filterCountries(val));
    setShowRunnerUpSuggestions(true);
    if (runnerUp) {
      setRunnerUp('');
      setRunnerUpCode('');
    }
  };

  const selectRunnerUp = (country) => {
    setRunnerUp(country.name);
    setRunnerUpCode(country.code);
    setRunnerUpQuery(country.name);
    setShowRunnerUpSuggestions(false);
  };

  const handleThirdPlaceChange = (e) => {
    const val = e.target.value;
    setThirdPlaceQuery(val);
    setThirdPlaceSuggestions(filterCountries(val));
    setShowThirdPlaceSuggestions(true);
    if (thirdPlace) {
      setThirdPlace('');
      setThirdPlaceCode('');
    }
  };

  const selectThirdPlace = (country) => {
    setThirdPlace(country.name);
    setThirdPlaceCode(country.code);
    setThirdPlaceQuery(country.name);
    setShowThirdPlaceSuggestions(false);
  };

  // Close suggestions lists on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowChampionSuggestions(false);
      setShowRunnerUpSuggestions(false);
      setShowThirdPlaceSuggestions(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Generate PNG image data URL from the DOM ticket
  const generateTicketImage = async () => {
    if (!ticketRef.current) return null;
    try {
      // Small delay to ensure rendering completes
      await new Promise((resolve) => setTimeout(resolve, 100));
      return await toPng(ticketRef.current, {
        cacheBust: true,
        backgroundColor: '#fcfbf7',
        pixelRatio: 2, // 2x scaling for high-resolution retina screens
        style: {
          transform: 'none',
          boxShadow: 'none',
        }
      });
    } catch (error) {
      console.error('Error generating image:', error);
      triggerToast('Error al generar la imagen del boleto.', 'error');
      return null;
    }
  };

  const handleDownload = async () => {
    if (!fullName) {
      triggerToast('Ingresa tu nombre para firmar el boleto.', 'error');
      return;
    }
    const dataUrl = await generateTicketImage();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `quiniela-${fullName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
    triggerToast('¡Imagen descargada con éxito!');
  };



  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Toast Alert */}
      {toast && (
        <div className={`alert-toast ${toast.type === 'error' ? 'alert-toast-error' : ''}`}>
          <span>{toast.type === 'error' ? '⚠️' : '🏆'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Hero Header */}
      <header style={{ padding: '2.5rem 1.5rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>

          {/* Circular Absolute Group logo placeholder */}
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: '4px solid #f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
            padding: '5px'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px dashed #0b1329',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0b1329',
              fontWeight: 'bold',
              fontSize: '0.6rem',
              textAlign: 'center',
              lineHeight: '0.75rem'
            }}>
              <span style={{ fontSize: '0.7rem', color: '#f59e0b' }}>★ ★ ★</span>
              <span>ABSOLUTE</span>
              <span style={{ fontSize: '0.5rem', opacity: 0.8 }}>GROUP INC.</span>
            </div>
          </div>

          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              letterSpacing: '-0.03em',
              margin: '0.5rem 0 0 0',
              textTransform: 'uppercase',
              background: 'linear-gradient(to right, #ffffff, #f59e0b, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
              Absolute World Cup Challenge
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#10b981',
              fontWeight: '700',
              letterSpacing: '0.15em',
              margin: '0.25rem 0 0 0',
              textTransform: 'uppercase'
            }}>
              Quiniela Mundialista
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main style={{
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '0 1.5rem 4rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>

        {/* Left column: prediction Form */}
        <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card-header">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Registra tus Predicciones
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              Rellena tu quiniela y genera la tarjeta coleccionable.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onClick={(e) => e.stopPropagation()}>

            {/* Full name */}
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Nombre Completo</label>
              <input
                id="fullName"
                type="text"
                className="form-input"
                placeholder="Ej. Juan Pérez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Champion Autocomplete */}
            <div className="form-group autocomplete-container">
              <label className="form-label" htmlFor="champion">Campeón del Mundo</label>
              <input
                id="champion"
                type="text"
                className="form-input"
                placeholder="Busca y selecciona un país..."
                value={championQuery}
                onChange={handleChampionChange}
                onFocus={() => {
                  if (championSuggestions.length > 0) setShowChampionSuggestions(true);
                }}
                required
              />
              {showChampionSuggestions && championSuggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {championSuggestions.map((country) => (
                    <div
                      key={`champ-${country.code}`}
                      className="autocomplete-option"
                      onClick={() => selectChampion(country)}
                    >
                      <img
                        src={`https://flagcdn.com/w40/${country.code}.png`}
                        width="20"
                        height="15"
                        alt={country.name}
                        crossOrigin="anonymous"
                      />
                      <span>{country.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Runner-up Autocomplete */}
            <div className="form-group autocomplete-container">
              <label className="form-label" htmlFor="runnerUp">Subcampeón del Mundo</label>
              <input
                id="runnerUp"
                type="text"
                className="form-input"
                placeholder="Busca y selecciona un país..."
                value={runnerUpQuery}
                onChange={handleRunnerUpChange}
                onFocus={() => {
                  if (runnerUpSuggestions.length > 0) setShowRunnerUpSuggestions(true);
                }}
                required
              />
              {showRunnerUpSuggestions && runnerUpSuggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {runnerUpSuggestions.map((country) => (
                    <div
                      key={`run-${country.code}`}
                      className="autocomplete-option"
                      onClick={() => selectRunnerUp(country)}
                    >
                      <img
                        src={`https://flagcdn.com/w40/${country.code}.png`}
                        width="20"
                        height="15"
                        alt={country.name}
                        crossOrigin="anonymous"
                      />
                      <span>{country.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Third Place Autocomplete */}
            <div className="form-group autocomplete-container">
              <label className="form-label" htmlFor="thirdPlace">Tercer Lugar del Mundo</label>
              <input
                id="thirdPlace"
                type="text"
                className="form-input"
                placeholder="Busca y selecciona un país..."
                value={thirdPlaceQuery}
                onChange={handleThirdPlaceChange}
                onFocus={() => {
                  if (thirdPlaceSuggestions.length > 0) setShowThirdPlaceSuggestions(true);
                }}
                required
              />
              {showThirdPlaceSuggestions && thirdPlaceSuggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {thirdPlaceSuggestions.map((country) => (
                    <div
                      key={`third-${country.code}`}
                      className="autocomplete-option"
                      onClick={() => selectThirdPlace(country)}
                    >
                      <img
                        src={`https://flagcdn.com/w40/${country.code}.png`}
                        width="20"
                        height="15"
                        alt={country.name}
                        crossOrigin="anonymous"
                      />
                      <span>{country.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Final Match Score */}
            <div className="form-group">
              <label className="form-label">Marcador Final Estimado</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="score-inputs">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    className="form-input score-input-number"
                    placeholder="0"
                    value={team1Score}
                    onChange={(e) => setTeam1Score(e.target.value)}
                    required
                  />
                  <span className="score-separator">-</span>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    className="form-input score-input-number"
                    placeholder="0"
                    value={team2Score}
                    onChange={(e) => setTeam2Score(e.target.value)}
                    required
                  />
                </div>

              </div>
            </div>

            {/* Top Scorer */}
            <div className="form-group">
              <label className="form-label" htmlFor="topScorer">Goleador del Torneo</label>
              <input
                id="topScorer"
                type="text"
                className="form-input"
                placeholder="Ej. Cristiano Ronaldo"
                value={topScorer}
                onChange={(e) => setTopScorer(e.target.value)}
                required
              />
            </div>


          </form>
        </section>

        {/* Right column: live notebook preview */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
              Vista Previa en Tiempo Real
            </h3>
          </div>

          {/* Ruled Notebook Paper Container */}
          <div
            ref={ticketRef}
            className="notebook-paper"
            style={{
              transform: 'rotate(0.5deg)',
              minHeight: '420px'
            }}
          >
            {/* Holes overlay */}
            <div className="notebook-paper-holes">
              <div className="notebook-paper-hole"></div>
              <div className="notebook-paper-hole"></div>
              <div className="notebook-paper-hole"></div>
              <div className="notebook-paper-hole"></div>
              <div className="notebook-paper-hole"></div>
              <div className="notebook-paper-hole"></div>
              <div className="notebook-paper-hole"></div>
              <div className="notebook-paper-hole"></div>
              <div className="notebook-paper-hole"></div>
              <div className="notebook-paper-hole"></div>
            </div>

            {/* Content lines */}
            <div className="handwritten">
              <div style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '1.5rem', fontSize: '2.1rem', letterSpacing: '0.05em', fontWeight: 'bold' }}>
                MI QUINIELA
              </div>

              <div style={{ marginBottom: '1rem', borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '0.25rem' }}>
                <span style={{ opacity: 0.6 }}>Nombre:</span>{' '}
                <span className="handwritten-blue">{fullName || '_________________'}</span>
              </div>

              <div style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ opacity: 0.6 }}>Campeón:</span>{' '}
                <span className="handwritten-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  {champion ? (
                    <>
                      {champion}
                      {championCode && (
                        <img
                          src={`https://flagcdn.com/w40/${championCode}.png`}
                          width="24"
                          height="18"
                          alt=""
                          style={{ border: '1px solid rgba(0,0,0,0.15)' }}
                          crossOrigin="anonymous"
                        />
                      )}
                    </>
                  ) : '_________________'}
                </span>
              </div>

              <div style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ opacity: 0.6 }}>Subcampeón:</span>{' '}
                <span className="handwritten-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  {runnerUp ? (
                    <>
                      {runnerUp}
                      {runnerUpCode && (
                        <img
                          src={`https://flagcdn.com/w40/${runnerUpCode}.png`}
                          width="24"
                          height="18"
                          alt=""
                          style={{ border: '1px solid rgba(0,0,0,0.15)' }}
                          crossOrigin="anonymous"
                        />
                      )}
                    </>
                  ) : '_________________'}
                </span>
              </div>

              <div style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ opacity: 0.6 }}>Tercer Lugar:</span>{' '}
                <span className="handwritten-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  {thirdPlace ? (
                    <>
                      {thirdPlace}
                      {thirdPlaceCode && (
                        <img
                          src={`https://flagcdn.com/w40/${thirdPlaceCode}.png`}
                          width="24"
                          height="18"
                          alt=""
                          style={{ border: '1px solid rgba(0,0,0,0.15)' }}
                          crossOrigin="anonymous"
                        />
                      )}
                    </>
                  ) : '_________________'}
                </span>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <div style={{ opacity: 0.6, fontSize: '1.4rem', lineHeight: '1.5rem' }}>Marcador en la final:</div>
                <div className="handwritten-blue" style={{ fontSize: '1.9rem', paddingLeft: '1rem', marginTop: '0.1rem' }}>
                  {team1Score !== '' && team2Score !== '' ? `${team1Score} - ${team2Score}` : '___ - ___'}
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <span style={{ opacity: 0.6, fontSize: '1.4rem', lineHeight: '1.5rem' }}>Goleador del torneo:</span>{' '}
                <span className="handwritten-blue" style={{ display: 'block', paddingLeft: '1rem', marginTop: '0.1rem', fontSize: '1.9rem', lineHeight: '1.9rem' }}>
                  {topScorer || '_________________'}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons for preview */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              onClick={handleDownload}
              className="btn btn-primary"
              type="button"
            >
              📥 Descargar Imagen
            </button>
          </div>
        </section>

      </main>

      {/* Footer info */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem 1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        color: 'var(--color-text-secondary)',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <span>⚽ ONE TEAM. ONE GOAL. WIN TOGETHER!</span>
          <span>🏆 ABSOLUTE GROUP INC.</span>
        </div>
        <p style={{ opacity: 0.5 }}>© 2026 Absolute Group World Cup Quiniela Challenge. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
