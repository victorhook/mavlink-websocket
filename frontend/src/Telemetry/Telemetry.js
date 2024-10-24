import 'bootstrap/dist/css/bootstrap.min.css';

function TelemetryTable({ telemetryData }) {
    return (
<table className="table">
  <thead>
    <tr>
      <th className="text-left" style={{ width: '50%' }}>Key</th>
      <th className="text-left" style={{ width: '50%' }}>Value</th>
    </tr>
  </thead>
  <tbody>
    {Object.entries(telemetryData).map(([key, value]) => (
      <tr key={key}>
        <td className="text-left">{key}</td>
        <td className="text-left">
          {typeof value === 'object' ? (
            <table className="table">
              <tbody>
                {Object.entries(value).map(([subKey, subValue]) => (
                  <tr key={subKey}>
                    <td className="text-left">{subKey}</td>
                    <td className="text-left">
                      {typeof subValue === 'number' ? subValue.toFixed(2) : subValue.toString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : typeof value === 'number' ? (
            value.toFixed(2)
          ) : (
            value.toString()
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>


    );
  }
  
  export default TelemetryTable;
  