import { useState } from 'react';
import { useShoppingList } from './hooks/useShoppingList';
import type { ShoppingItem } from './types';
import { Header } from './components/Header';
import { ConnectionBanner } from './components/ConnectionBanner';
import { QuickAddItem } from './components/QuickAddItem';
import { FilterBar } from './components/FilterBar';
import { ItemCard } from './components/ItemCard';
import { EmptyState } from './components/EmptyState';
import { UserModal } from './components/UserModal';
import { SettingsModal } from './components/SettingsModal';
import { ShareListModal } from './components/ShareListModal';
import { EditItemModal } from './components/EditItemModal';
import { ConfirmModal } from './components/ConfirmModal';
import { Loader2, RefreshCw } from 'lucide-react';


export function App() {
  const {
    items,
    filteredItems,
    counts,
    loading,
    connectionStatus,
    filterStatus,
    setFilterStatus,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    userProfile,
    setUserProfile,
    addItem,
    togglePurchased,
    updateItem,
    deleteItem,
    clearPurchased,
    reloadItems
  } = useShoppingList();

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await reloadItems();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-100 selection:text-emerald-800">
      {/* Top Navigation Bar */}
      <Header
        connectionStatus={connectionStatus}
        userProfile={userProfile}
        pendingCount={counts.pending}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 space-y-4 pb-20">
        {/* Local Demo notification banner */}
        {connectionStatus === 'local_demo' && (
          <ConnectionBanner onOpenSettings={() => setIsSettingsModalOpen(true)} />
        )}

        {/* Quick Add Product Card */}
        <QuickAddItem onAdd={addItem} />

        {/* Filter and Category Navigation */}
        <FilterBar
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          counts={counts}
          onClearPurchased={() => setIsConfirmClearOpen(true)}
        />

        {/* List Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-xs font-medium">Φόρτωση λίστας...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            filterStatus={filterStatus}
            hasItemsAtAll={items.length > 0}
            searchQuery={searchQuery}
          />
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onToggle={togglePurchased}
                onEdit={(it) => setEditingItem(it)}
                onDelete={deleteItem}
              />
            ))}
          </div>
        )}

        {/* Manual Refresh & Stats Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-4 px-1">
          <span>
            {counts.total} προϊόντα • {counts.pending} εκκρεμή • {counts.purchased} αγορασμένα
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            title="Ανανέωση λίστας"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Ανανέωση</span>
          </button>
        </div>
      </main>

      {/* User Onboarding & Profile Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
      />

      {/* Settings & Supabase Cloud Sync Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onConfigChanged={() => {
          reloadItems();
        }}
      />

      {/* Share / WhatsApp Formatted List Modal */}
      <ShareListModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        items={items}
      />

      {/* Edit Item Details Modal */}
      <EditItemModal
        item={editingItem}
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        onSave={updateItem}
      />

      {/* Confirm Clear Purchased Items Modal */}
      <ConfirmModal
        isOpen={isConfirmClearOpen}
        onClose={() => setIsConfirmClearOpen(false)}
        onConfirm={clearPurchased}
        title="Εκκαθάριση Αγορασμένων;"
        message={`Θα διαγραφούν οριστικά ${counts.purchased} αγορασμένα προϊόντα από τη λίστα.`}
        confirmLabel="Εκκαθάριση"
      />
    </div>
  );
}

export default App;
