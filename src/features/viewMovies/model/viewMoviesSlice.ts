import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MovieService, GetDTO } from '../api/movie.service'
import { MovieDocsResponseDtoV14 } from '@shared/types/types'

interface Pagination {
	page: number
	limit: number
}

export interface State {
	filmsList: MovieDocsResponseDtoV14 | null
	loading: boolean
	error: string | null | undefined
	pagination: Pagination
}

const initial: State = {
	filmsList: null,
	loading: false,
	error: null,
	pagination: {
		page: 1,
		limit: 20
	}
}

// Асинхронное действие для запроса к API
export const loadAllFilms = createAsyncThunk('viewFilms/loadAllFilms', async (params: GetDTO) => {
	return await MovieService.getFilms(params)
})

const viewMoviesSlice = createSlice({
	//ключ viewFilms для текущего слайса
	// Это имя используется для генерации действий
	name: 'viewFilms',
	initialState: initial,
	reducers: {
		updatePagination(state, action: PayloadAction<Pagination>) {
			state.pagination = action.payload
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadAllFilms.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(loadAllFilms.fulfilled, (state, action) => {
				state.loading = false
				state.filmsList = action.payload // Записываем данные в стейт
			})
			.addCase(loadAllFilms.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message // Обрабатываем ошибку
			})
	}
})

export const { updatePagination } = viewMoviesSlice.actions

export const viewMoviesReducer = viewMoviesSlice.reducer
