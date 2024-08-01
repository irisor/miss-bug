import { useEffect, useState } from 'react';

export function BugSort({ filterBy, onSetFilterBy }) {
	const [sortBy, setSortBy] = useState(filterBy.sortBy || 'none');

	useEffect(() => {
		if (sortBy && sortBy !== 'none') {
			const sortDir = sortBy === 'createdAt' ? -1 : 1
			if (sortDir === -1) onSetFilterBy({ ...filterBy, sortBy, sortDir })
			else onSetFilterBy({ ...filterBy, sortBy })
		}
	}, [sortBy]);

	function handleSortChange({ target }) {
		setSortBy(target.value);
	}

	// function handleFormSubmit(e) {
	//     e.preventDefault();
	//     onSetFilterBy({ ...filterBy, sortBy })
	// }

	return (
		<section className="bug-sort">
			<h2>Sort Bugs</h2>
			<form /*onSubmit={handleFormSubmit}*/>
				<label htmlFor="sort">Sort by:</label>
				<select id="sort" name="sort" value={sortBy} onChange={handleSortChange}>
					<option value="none">None</option>
					<option value="title">Title</option>
					<option value="severity">Severity</option>
					<option value="createdAt">Created At</option>
				</select>
			</form>
		</section>
	)
}