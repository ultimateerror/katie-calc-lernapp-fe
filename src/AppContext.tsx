import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from 'react';

const AppContext = createContext<{ userId: string } | null>(null);

export function AppContextProvider({ children }: { children: ReactNode }) {
	const [userId, setUserId] = useState<string>(crypto.randomUUID());

	useEffect(() => {
		const storedId = localStorage.getItem('userId');

		if (!storedId) {
			localStorage.setItem('userId', userId);
			return;
		}

		setUserId(storedId);
	}, []);

	return (
		<AppContext.Provider value={{ userId }}>{children}</AppContext.Provider>
	);
}

export function useAppContext() {
	const context = useContext(AppContext);

	if (!context?.userId) {
		throw new Error('AppContext was not registered correctly.');
	}

	return context;
}
