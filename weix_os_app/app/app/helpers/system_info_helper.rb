module SystemInfoHelper

  def self.cpu_usage
    file = File.join(Rails.root, 'system_info', 'cpu.txt')
    cpu = File.read(file)
    result = cpu.gsub(/(?!([0-9]|\.))./, '').squish
    result
  end

  def self.memory_usage
    file = File.join(Rails.root, 'system_info', 'memory.txt')
    memory_usage = File.read(file)
    result = memory_usage.gsub(/(?!([0-9]))./, '').squish
    result
  end

  def self.swap_usage
    file = File.join(Rails.root, 'system_info', 'swap.txt')
    memory_usage = File.read(file)
    result = memory_usage.gsub(/(?!([0-9]))./, '').squish
    result
  end

  def self.temperature
    file = File.join(Rails.root, 'system_info', 'temp.txt')
    temperature = File.read(file)
    result = temperature.gsub(/(?!([0-9]|\.))./, '').squish
    result
  end

  def self.upgradables
    file = File.join(Rails.root, 'system_info', 'upgradable.txt')
    upgradables = File.read(file)
    result = upgradables.gsub(/(?!([0-9]))./, '').squish
    result
  end
  
end
