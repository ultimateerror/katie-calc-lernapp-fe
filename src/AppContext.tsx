import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from 'react';

const AppContext = createContext<{ childId: string } | null>(null);

export function AppContextProvider({ children }: { children: ReactNode }) {
	const [childId, setChildId] = useState<string>(crypto.randomUUID());

	useEffect(() => {
		const storedId = localStorage.getItem('childId');

		if (!storedId) {
			localStorage.setItem('childId', childId);
			return;
		}

		setChildId(storedId);
	}, []);

	return (
		<AppContext.Provider value={{ childId }}>{children}</AppContext.Provider>
	);
}

export function useAppContext() {
	const context = useContext(AppContext);

	if (!context?.childId) {
		throw new Error('AppContext was not registered correctly.');
	}

	return context;
}
