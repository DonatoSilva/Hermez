import { usePersonStats } from "./hooks/usePersonStats";

type PersonStatsProps = {
  personId: string | undefined;
  token: string;
};

export function PersonStats({ personId, token }: PersonStatsProps) {
  const { stats, loading } = usePersonStats({ token, personId });

  // Formatear el dinero ganado
  const formatMoney = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Mientras carga, mostrar valores por defecto o skeleton
  if (loading || !stats) {
    return (
      <div className="flex flex-row justify-between gap-4 rounded-md border bg-H-blue-100 border-H-blue-300 p-4 w-full md:max-w-md">
        <div className="flex flex-col justify-start items-start w-full">
          <span className="text-H-blue-900 font-bold">Dinero ganado:</span>
          <span className="text-H-blue-700 animate-pulse">Cargando...</span>
        </div>
        <div className="min-h-max w-[0.5px] bg-H-blue-300"></div>
        <div className="flex flex-col justify-start items-start w-full">
          <span className="text-H-blue-900 font-bold">N° Domicilios:</span>
          <span className="text-H-blue-700 animate-pulse">...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-between gap-4 rounded-md border bg-H-blue-100 border-H-blue-300 p-4 w-full md:max-w-md">
      <div className="flex flex-col justify-start items-start w-full">
        <span className="text-H-blue-900 font-bold">Dinero ganado:</span>
        <span className="text-H-blue-700">
          {formatMoney(stats.total)}
        </span>
      </div>
      <div className="min-h-max w-[0.5px] bg-H-blue-300"></div>
      <div className="flex flex-col justify-start items-start w-full">
        <span className="text-H-blue-900 font-bold">N° Domicilios:</span>
        <span className="text-H-blue-700">{stats.count}</span>
      </div>
    </div>
  );
}
