import { FiPlus, FiTrash2 } from 'react-icons/fi';

const createKey = () => `model_${Date.now()}_${Math.random().toString(36).slice(2)}`;

const ProductModelEditor = ({ models, setModels, specifications, setSpecifications }) => {
  const addModel = () => {
    setModels([
      ...models,
      {
        _key: createKey(),
        model_code: '',
        display_name: '',
        nominal_power: '',
        is_default: models.length === 0,
      },
    ]);
  };

  const updateModel = (modelKey, field, value) => {
    setModels(models.map((model) => {
      if (field === 'is_default') return { ...model, is_default: model._key === modelKey };
      return model._key === modelKey ? { ...model, [field]: value } : model;
    }));
  };

  const removeModel = (modelKey) => {
    const remaining = models.filter((model) => model._key !== modelKey);
    if (remaining.length > 0 && !remaining.some((model) => model.is_default)) {
      remaining[0] = { ...remaining[0], is_default: true };
    }
    setModels(remaining);
    setSpecifications(specifications.map((specification) => {
      const nextValues = { ...(specification.model_values || {}) };
      delete nextValues[modelKey];
      return { ...specification, model_values: nextValues };
    }));
  };

  const addSpecification = () => {
    setSpecifications([
      ...specifications,
      {
        section_name: 'General',
        spec_key: '',
        label: '',
        unit: '',
        value_mode: 'shared',
        shared_value: '',
        model_values: {},
      },
    ]);
  };

  const updateSpecification = (index, field, value) => {
    setSpecifications(specifications.map((specification, specificationIndex) => (
      specificationIndex === index ? { ...specification, [field]: value } : specification
    )));
  };

  const updateModelValue = (index, modelKey, value) => {
    setSpecifications(specifications.map((specification, specificationIndex) => (
      specificationIndex === index
        ? { ...specification, model_values: { ...(specification.model_values || {}), [modelKey]: value } }
        : specification
    )));
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-gray-900">Models</h4>
            <p className="mt-1 text-sm text-gray-500">Add each selectable model in this product family.</p>
          </div>
          <button type="button" onClick={addModel} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <FiPlus /> Add Model
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-200">
          <table className="min-w-[850px] w-full text-sm">
            <thead className="bg-gray-100 text-left text-gray-600">
              <tr>
                <th className="px-3 py-2">Default</th>
                <th className="px-3 py-2">Model code</th>
                <th className="px-3 py-2">Display name</th>
                <th className="px-3 py-2">Nominal power</th>
                <th className="w-12 px-3 py-2"><span className="sr-only">Remove</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {models.map((model) => (
                <tr key={model._key}>
                  <td className="px-3 py-2 text-center">
                    <input type="radio" name="default-model" checked={Boolean(model.is_default)} onChange={() => updateModel(model._key, 'is_default', true)} />
                  </td>
                  <td className="px-3 py-2"><input required className="w-full border p-2" value={model.model_code} onChange={(event) => updateModel(model._key, 'model_code', event.target.value)} /></td>
                  <td className="px-3 py-2"><input className="w-full border p-2" value={model.display_name} onChange={(event) => updateModel(model._key, 'display_name', event.target.value)} /></td>
                  <td className="px-3 py-2"><input className="w-full border p-2" placeholder="6kW" value={model.nominal_power} onChange={(event) => updateModel(model._key, 'nominal_power', event.target.value)} /></td>
                  <td className="px-3 py-2"><button type="button" onClick={() => removeModel(model._key)} className="p-2 text-red-600" aria-label={`Remove ${model.model_code || 'model'}`}><FiTrash2 /></button></td>
                </tr>
              ))}
              {models.length === 0 && <tr><td colSpan="5" className="px-4 py-6 text-center text-gray-500">Add the first model to start the comparison matrix.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-gray-900">Specification Matrix</h4>
            <p className="mt-1 text-sm text-gray-500">Choose Shared when every model has one value, or Custom for model-specific values.</p>
          </div>
          <button type="button" onClick={addSpecification} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <FiPlus /> Add Specification
          </button>
        </div>

        <div className="space-y-4">
          {specifications.map((specification, index) => (
            <div key={index} className="border border-gray-200 bg-gray-50 p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                <input className="border p-2 text-sm" placeholder="Section" value={specification.section_name} onChange={(event) => updateSpecification(index, 'section_name', event.target.value)} />
                <input required className="border p-2 text-sm" placeholder="Specification label" value={specification.label} onChange={(event) => updateSpecification(index, 'label', event.target.value)} />
                <input className="border p-2 text-sm" placeholder="Key" value={specification.spec_key} onChange={(event) => updateSpecification(index, 'spec_key', event.target.value)} />
                <input className="border p-2 text-sm" placeholder="Unit" value={specification.unit || ''} onChange={(event) => updateSpecification(index, 'unit', event.target.value)} />
                <div className="flex gap-2">
                  <select className="min-w-0 flex-1 border p-2 text-sm" value={specification.value_mode} onChange={(event) => updateSpecification(index, 'value_mode', event.target.value)}>
                    <option value="shared">Shared</option>
                    <option value="custom">Custom</option>
                  </select>
                  <button type="button" onClick={() => setSpecifications(specifications.filter((_, specificationIndex) => specificationIndex !== index))} className="p-2 text-red-600" aria-label="Remove specification"><FiTrash2 /></button>
                </div>
              </div>

              {specification.value_mode === 'shared' ? (
                <input className="mt-3 w-full border bg-white p-2 text-sm" placeholder="Value shared by every model" value={specification.shared_value || ''} onChange={(event) => updateSpecification(index, 'shared_value', event.target.value)} />
              ) : (
                <div className="mt-3 overflow-x-auto">
                  <div className="flex min-w-max gap-3">
                    {models.map((model) => (
                      <label key={model._key} className="block w-44 text-xs font-semibold text-gray-600">
                        <span className="mb-1 block truncate">{model.model_code || 'Unnamed model'}</span>
                        <input className="w-full border bg-white p-2 text-sm font-normal text-gray-900" value={specification.model_values?.[model._key] || ''} onChange={(event) => updateModelValue(index, model._key, event.target.value)} />
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductModelEditor;
