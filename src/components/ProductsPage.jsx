function ProductsPage({ menuData }) {
  const navigate = useNavigate();

  const [activeCategoryId, setActiveCategoryId] = React.useState(
    CATEGORY_CONFIG[0].id
  );

  const activeCategoryConfig = CATEGORY_CONFIG.find(
    (c) => c.id === activeCategoryId
  );

  const filteredItems = menuData.filter((item) =>
    activeCategoryConfig.matchCategories.includes(item.category)
  );

  return (
    <main className="container">
      {/* Back */}
      <button className="back-link" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 style={{ marginBottom: "0.8rem" }}>All Products</h1>

      {/* CATEGORY TABS */}
      <div className="category-tabs">
        {CATEGORY_CONFIG.map((cat) => (
          <button
            key={cat.id}
            className={
              "category-tab " +
              (cat.id === activeCategoryId ? "active" : "")
            }
            onClick={() => setActiveCategoryId(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="menu-grid" style={{ marginTop: "1.5rem" }}>
        {filteredItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}

        {filteredItems.length === 0 && (
          <p style={{ color: "#777" }}>
            No products found in this category.
          </p>
        )}
      </div>
    </main>
  );
}
