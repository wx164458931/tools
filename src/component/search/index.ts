import Search from "./search";
import SearchItem from "./searchItem";
import { useSearch } from './hooks'

type SearchType = typeof Search

(Search as unknown as object & {
  Item: typeof SearchItem
}).Item = SearchItem;

(Search as unknown as object & {
  useSearch: typeof useSearch
}).useSearch = useSearch;

export default Search as unknown as SearchType & {
  Item: typeof SearchItem
} & {
  useSearch: typeof useSearch
};

export {
  SearchItem
}