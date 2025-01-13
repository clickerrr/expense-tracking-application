import { createContext } from 'react';
import Category from '../../types/Category';
export interface CategoryListContextProps {
	categoryList: Category[];
	updateCategoryList: (categoryList: Category[]) => void;
}
const CategoryListContext = createContext<CategoryListContextProps | undefined>(undefined);
export default CategoryListContext;
