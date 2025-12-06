import React, { useEffect, useState, useRef } from 'react';
import { ContentHeader } from './ContentHeader';
import { useAppContext } from './AppContext';

const API_BASE = 'https://skillboost.foreach.at/api/public';

export default function SkillBoostTrainer(): JSX.Element {
	const [skills, setSkills] = useState<any[]>([]);
	const [selectedSkill, setSelectedSkill] = useState<string>('MUL_TABLE');

	const [exerciseSets, setExerciseSets] = useState<any[]>([]);
	const [selectedSetId, setSelectedSetId] = useState<string>('');

	const [exercises, setExercises] = useState<any[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answer, setAnswer] = useState('');
	const [feedback, setFeedback] = useState<any | null>(null);
	const [loading, setLoading] = useState(false);

	const formRef = useRef<HTMLFormElement | null>(null);
	const answerInputRef = useRef<HTMLInputElement | null>(null);
	const taskCardRef = useRef<HTMLDivElement | null>(null);

	formRef?.current?.scrollIntoView({ behavior: 'instant' });

	const { childId } = useAppContext();

	// Skills laden
	useEffect(() => {
		fetch(`${API_BASE}/skills`)
			.then(res => res.json())
			.then(setSkills)
			.catch(err => console.error('Error loading skills', err));
	}, []);

	// Sets laden
	useEffect(() => {
		if (!selectedSkill) return;
		setExerciseSets([]);
		setSelectedSetId('');
		fetch(
			`${API_BASE}/exercise-sets?skill=${encodeURIComponent(selectedSkill)}`
		)
			.then(res => res.json())
			.then(data => {
				setExerciseSets(data);
				if (data.length > 0) {
					setSelectedSetId(String(data[0].id));
				}
			})
			.catch(err => console.error('Error loading sets', err));
	}, [selectedSkill]);

	const loadExercises = async () => {
		if (!selectedSkill || !selectedSetId) return;
		setLoading(true);
		setFeedback(null);
		setAnswer('');
		setCurrentIndex(0);

		try {
			const res = await fetch(
				`${API_BASE}/exercises?skill=${encodeURIComponent(
					selectedSkill
				)}&exerciseSetId=${selectedSetId}&limit=10`
			);
			const data = await res.json();
			setExercises(data.exercises || []);
		} catch (e) {
			console.error('Error loading exercises', e);
		} finally {
			setLoading(false);
		}
	};

	const currentExercise = exercises[currentIndex] || null;

	const renderQuestion = () => {
		if (!currentExercise) return 'Noch keine Aufgabe 😊';

		const payload = currentExercise.payload;
		if (selectedSkill === 'MUL_TABLE' && payload) {
			return `${payload.a} × ${payload.b}`;
		}

		return 'Aufgabe';
	};

	// Beim Wechsel der Aufgabe immer Eingabefeld fokussieren
	useEffect(() => {
		if (answerInputRef.current) {
			answerInputRef.current.focus();
		}
	}, [currentIndex, exercises.length]);

	const handleSubmitAnswer = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!currentExercise || answer.trim() === '') return;

		const payload = currentExercise.payload;
		const givenNumber = Number(answer);

		const body = {
			childId,
			skill: selectedSkill,
			exerciseSetId: Number(selectedSetId),
			exerciseId: currentExercise.id,
			payload,
			givenAnswer: givenNumber,
			responseTimeMs: 0
		};

		try {
			const res = await fetch(`${API_BASE}/exercise-attempts`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
			const data = await res.json();

			setFeedback({
				correct: data.correct,
				correctAnswer: data.correctAnswer
			});

			setTimeout(() => {
				setAnswer('');
				setFeedback(null);
				setCurrentIndex(prev =>
					prev + 1 < exercises.length ? prev + 1 : prev
				);
			}, 1200);
		} catch (e2) {
			console.error('Error saving attempt', e2);
		}
	};

	const progress =
		exercises.length > 0
			? Math.round(((currentIndex + 1) / exercises.length) * 100)
			: 0;

	return (
		<div
			style={{
				padding: '1rem'
			}}
		>
			<div
				style={{
					width: '100%',
					maxWidth: 480,
					margin: '0 auto',
					backgroundColor: 'white',
					borderRadius: 24,
					padding: '1rem',
					boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem'
				}}
			>
				<ContentHeader
					label="SkillBoost"
					icon="🧠"
					subtitle="Spielerisch rechnen lernen ✨"
				/>

				{/* Einstellungen */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr',
						gap: '0.75rem'
					}}
				>
					<div>
						<label
							style={{ fontSize: '0.85rem', color: '#555', display: 'block' }}
						>
							Übungsart
						</label>
						<select
							value={selectedSkill}
							onChange={e => setSelectedSkill(e.target.value)}
							style={{
								marginTop: '0.2rem',
								width: '100%',
								padding: '0.4rem 0.6rem',
								borderRadius: 999,
								border: '1px solid #ddd',
								backgroundColor: '#fdfdfd'
							}}
						>
							{skills.map(s => (
								<option key={s.id} value={s.code}>
									{s.name}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							style={{ fontSize: '0.85rem', color: '#555', display: 'block' }}
						>
							Übungs-Set
						</label>
						<select
							value={selectedSetId}
							onChange={e => setSelectedSetId(e.target.value)}
							style={{
								marginTop: '0.2rem',
								width: '100%',
								padding: '0.4rem 0.6rem',
								borderRadius: 999,
								border: '1px solid #ddd',
								backgroundColor: '#fdfdfd'
							}}
						>
							{exerciseSets.map(set => (
								<option key={set.id} value={set.id}>
									{set.name}
								</option>
							))}
						</select>
					</div>
				</div>

				<button
					onClick={loadExercises}
					disabled={loading || !selectedSetId}
					style={{
						width: '100%',
						padding: '0.6rem 1rem',
						borderRadius: 999,
						border: 'none',
						fontSize: '1rem',
						fontWeight: 600,
						cursor: loading || !selectedSetId ? 'default' : 'pointer',
						background: loading || !selectedSetId ? '#ccc' : '#ff9f1c',
						color: 'white'
					}}
				>
					{loading ? 'Lade Aufgaben…' : '🎮 Übung starten'}
				</button>

				{/* Aufgabenbereich – wichtig für Mobile */}
				{exercises.length > 0 && (
					<div
						ref={taskCardRef}
						style={{
							marginTop: '0.5rem',
							padding: '1rem',
							borderRadius: 20,
							backgroundColor: '#f8fafc',
							border: '1px solid #e2e8f0'
						}}
					>
						{/* Fortschritt */}
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: '0.5rem',
								fontSize: '0.85rem',
								color: '#555'
							}}
						>
							<span>
								Aufgabe {currentIndex + 1} von {exercises.length}
							</span>
							<span>{progress}% ✅</span>
						</div>

						{/* Frage */}
						<div style={{ textAlign: 'center', marginBottom: '1rem' }}>
							<div style={{ fontSize: '0.9rem', color: '#64748b' }}>
								Rechne:
							</div>
							<div
								style={{
									fontSize: '2.4rem',
									fontWeight: 700,
									marginTop: '0.3rem'
								}}
							>
								{renderQuestion()} <span style={{ fontSize: '1.6rem' }}>=</span>
							</div>
						</div>

						{/* Eingabe */}
						<form onSubmit={handleSubmitAnswer} ref={formRef}>
							<input
								ref={answerInputRef}
								type="tel"
								inputMode="numeric"
								pattern="[0-9]*"
								value={answer}
								onChange={e => setAnswer(e.target.value)}
								onFocus={() => {
									setTimeout(() => {
										taskCardRef.current?.scrollIntoView({
											behavior: 'smooth',
											block: 'center'
										});
									}, 100);
								}}
								style={{
									width: '100%',
									padding: '0.6rem 0.8rem',
									fontSize: '1.4rem',
									textAlign: 'center',
									borderRadius: 999,
									border: '2px solid #cbd5f5',
									outline: 'none'
								}}
							/>
							<button
								type="submit"
								style={{
									marginTop: '0.8rem',
									width: '100%',
									padding: '0.55rem 1rem',
									borderRadius: 999,
									border: 'none',
									fontSize: '1rem',
									fontWeight: 600,
									cursor: 'pointer',
									background: '#0ea5e9',
									color: 'white'
								}}
							>
								✅ Antwort prüfen
							</button>
						</form>

						{feedback && (
							<div
								style={{
									// marginTop: '0.9rem',
									padding: '0.5rem 0.6rem',
									borderRadius: 12,
									textAlign: 'center',
									backgroundColor: feedback.correct ? '#dcfce7' : '#fee2e2',
									color: feedback.correct ? '#166534' : '#b91c1c',
									border: `2px solid ${feedback.correct ? 'green' : 'red'}`,
									fontWeight: 600,
									fontSize: '0.95rem',
									position: 'absolute',
									inset: '1rem',
									bottom: 'auto'
								}}
							>
								{feedback.correct ? (
									<>🎉 Super! Das war richtig.</>
								) : (
									<>😕 Fast! Richtig wäre {feedback.correctAnswer} gewesen.</>
								)}
							</div>
						)}
					</div>
				)}

				{exercises.length === 0 && !loading && (
					<p
						style={{
							marginTop: '0.5rem',
							fontSize: '0.95rem',
							color: '#64748b',
							textAlign: 'center'
						}}
					>
						Wähle oben eine Übung und tippe auf <strong>„Übung starten“</strong>
						, um loszulegen 🚀
					</p>
				)}
			</div>
		</div>
	);
}
