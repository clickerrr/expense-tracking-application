interface ButtonProps {
	text: string;
	onButtonPress: (event: MouseEvent<HTMLButtonElement>) => void;
	style?: object;
}

const Button = ({text, onButtonPress, style}: ButtonProps) => {
	return (
		<button className="button" style={style !== undefined ? style : {}} onClick={onButtonPress}>
			{text}
		</button>
	);
};

export default Button;
