import {useEffect} from 'react';

interface StartingBalanceInputProps {
	title: string;
	value: number;
	setValue: (newValue: number) => void;
}

const StartingBalanceInput = ({title, value, setValue}: StartingBalanceInputProps) => {
	useEffect(() => {}, [title, value, setValue]);
	return (
		<div>
			<span>{title}</span>
			$
			<input
				onChange={event => {
					setValue(Number(event.target.value));
				}}
				value={value}
			/>
		</div>
	);
};
export default StartingBalanceInput;
