import {useEffect, useState} from 'react';
import BudgetCategoryItem from '@/types/BudgetCategoryItem';
import editLogo from '@/assets/edit-icon.svg';

interface BudgetCategoryElementProps {
	data: BudgetCategoryItem;
}
const BudgetCategoryElement = ({data}: BudgetCategoryElementProps) => {
	const [showEditingIcon, setShowEditingIcon] = useState(false);
	const [editing, setEditing] = useState(false);
	const [planned, setPlanned] = useState(data.planned);

	useEffect(() => {}, [data]);

	const handleCancel = () => {
		setEditing(false);
	};

	const handleSubmit = () => {
		setEditing(false);
		data.planned = planned;
	};

	return (
		<div
			className={`expenses-category-line ${'expenses-category-line-hover'}`}
			onMouseOver={() => {
				setShowEditingIcon(true);
			}}
			onMouseLeave={() => {
				setShowEditingIcon(false);
			}}>
			{!editing ? (
				<>
					{showEditingIcon ? (
						<button
							className={'expenses-category-edit-button'}
							onClick={() => setEditing(true)}>
							<img className={'expenses-category-edit-icon'} src={editLogo} />
						</button>
					) : (
						<></>
					)}
					<div className="expenses-category-name">
						<span>{data.title}</span>
					</div>

					<div className="expenses-category-planned">
						<span>${planned}</span>
					</div>

					<div className="expenses-category-actual">
						<span>${data.actual}</span>
					</div>
					<div className="expenses-category-diff">
						<span>${data.planned - data.actual}</span>
					</div>
				</>
			) : (
				<>
					<div>
						<input
							type={'number'}
							value={planned}
							onChange={event => {
								setPlanned(Number(event.target.value));
							}}
						/>
					</div>
					<div
						onClick={() => {
							handleCancel();
						}}>
						<button>Cancel</button>
					</div>
					<div
						onClick={() => {
							handleSubmit();
						}}>
						<button>Submit</button>
					</div>
				</>
			)}
		</div>
	);
};

export default BudgetCategoryElement;
