import { ReactNode } from 'react';

export function ContentHeader({
	label,
	icon,
	subtitle
}: {
	label: string;
	icon: ReactNode;
	subtitle: string;
}) {
	return (
		<div>
			<h1 style={{ margin: 0, fontSize: '1.5rem' }}>
				{icon} {label}
			</h1>
			<div style={{ fontSize: '0.9rem', color: '#777' }}>{subtitle}</div>
		</div>
	);
}
