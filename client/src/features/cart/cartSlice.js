import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action) {
            const { id, qty, note } = action.payload;

            const existing = state.items.find(item => item.id === id);

            if (existing) {
                existing.qty += qty;
                if (typeof note === 'string') existing.note = note;
            } else {
                state.items.push({ id, qty, ...(typeof note === 'string' ? { note } : {}) });
            }
        },

        setQty(state, action) {
            const { id, qty } = action.payload;
            const idNum = Number(id);
            const q = Number(qty);
            const item = state.items.find(i => i.id === idNum);
            if (!item) return;
            const safeQty = Number.isFinite(q) && q > 0 ? Math.floor(q) : 1;
            item.qty = safeQty;
            },

            removeItem(state, action) {
            const { id } = action.payload;
            const idNum = Number(id);
            state.items = state.items.filter(i => i.id !== idNum);
            },

            setNote(state, action) {
            const { id, note } = action.payload;
            const idNum = Number(id);
            const item = state.items.find(i => i.id === idNum);
            if (!item) return;
            item.note = note || '';
        },

        clearCart(state, action) {
            state.items = [];
        },
    },
});

export const { addItem, setQty, removeItem, setNote, clearCart } = cartSlice.actions;
export default cartSlice.reducer;