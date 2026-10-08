const formatValue = (value, unit) => {
  if (value === null || value === undefined || value === '') return '-';
  return unit ? `${value} ${unit}` : String(value);
};

const isSameLabel = (left, right) =>
  String(left || '').trim().toLowerCase() === String(right || '').trim().toLowerCase();

const ProductSpecificationTable = ({ models, specifications }) => {
  if (!models?.length || !specifications?.length) return null;

  const sections = specifications.reduce((groups, specification) => {
    const sectionName = specification.section_name || 'General';
    if (!groups[sectionName]) groups[sectionName] = [];
    groups[sectionName].push(specification);
    return groups;
  }, {});

  return (
    <div className="isolate overflow-x-auto border border-gray-200 bg-white shadow-sm">
      <table className="w-max min-w-full border-separate border-spacing-0 text-[11px] sm:text-xs lg:text-sm">
        <thead>
          <tr className="bg-gray-950 text-white">
            <th className="min-w-[170px] max-w-[190px] border-b border-r border-gray-700 bg-gray-950 px-2.5 py-2.5 text-left sm:min-w-[190px]">Specification</th>
            {models.map((model) => {
              const modelLabel = model.display_name || model.model_code;
              const showNominalPower = model.nominal_power && !isSameLabel(modelLabel, model.nominal_power);

              return (
                <th key={model.id || model.model_code} className="min-w-[112px] max-w-[128px] border-b border-r border-gray-700 bg-gray-950 px-2 py-2.5 text-center last:border-r-0 sm:min-w-[120px]">
                  <span className="block break-words font-bold leading-tight">{modelLabel}</span>
                  {showNominalPower && <span className="mt-0.5 block font-normal leading-tight text-gray-300">{model.nominal_power}</span>}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Object.entries(sections).map(([sectionName, sectionSpecifications]) => (
            <FragmentSection key={sectionName} sectionName={sectionName} specifications={sectionSpecifications} models={models} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FragmentSection = ({ sectionName, specifications, models }) => (
  <>
    <tr>
      <th colSpan={models.length + 1} className="bg-[#094fa4]/10 px-2.5 py-2 text-left text-xs font-bold uppercase text-[#073b7a]">
        {sectionName}
      </th>
    </tr>
    {specifications.map((specification) => (
      <tr key={specification.id || specification.spec_key} className="border-t border-gray-200 even:bg-gray-50">
        <th className="max-w-[190px] border-r border-gray-200 bg-inherit px-2.5 py-2 text-left font-semibold leading-snug text-gray-700">
          {specification.label}
        </th>
        {specification.value_mode === 'shared' ? (
          <td colSpan={models.length} className="px-2.5 py-2 text-center font-medium leading-snug text-gray-900">
            {formatValue(specification.shared_value, specification.unit)}
          </td>
        ) : models.map((model) => (
          <td key={model.id || model.model_code} className="max-w-[128px] border-r border-gray-200 px-2 py-2 text-center leading-snug text-gray-900 last:border-r-0">
            {formatValue(specification.model_values?.[model.model_code], specification.unit)}
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default ProductSpecificationTable;
