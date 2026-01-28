const fs = require('fs');
const path = require('path');

// Generic descriptions and features by category
const categoryData = {
  "Brood Boxes": {
    desc: "Premium quality brood box designed for optimal hive management and bee health. Expertly crafted from durable materials to withstand the elements.",
    features: [
      "Precision-engineered joinery for weather resistance",
      "Compatible with standard beekeeping frames",
      "Smooth interior finish prevents propolis buildup",
      "Pre-treated wood for extended lifespan"
    ]
  },
  "Supers": {
    desc: "High-quality honey super for maximum honey production. Built to professional standards with attention to detail and bee welfare.",
    features: [
      "Lightweight yet durable construction",
      "Easy to stack and handle during harvest",
      "Precision-cut frame rests for proper spacing",
      "Weather-resistant exterior finish"
    ]
  },
  "Nucs & Travel": {
    desc: "Reliable nucleus hive or travel box for safe colony transport and splits. Essential equipment for expanding your apiary or moving bees.",
    features: [
      "Secure ventilation system for bee safety",
      "Robust construction for reliable transport",
      "Easy access for inspection and feeding",
      "Suitable for splits and swarm capture"
    ]
  },
  "Floors & Stands": {
    desc: "Sturdy hive floor or stand providing essential elevation and ventilation. Critical component for maintaining healthy colonies and ease of inspection.",
    features: [
      "Stable design prevents hive tipping",
      "Proper ground clearance for pest control",
      "Weather-resistant materials",
      "Easy assembly and maintenance"
    ]
  },
  "Lids & Roofs": {
    desc: "Weather-proof hive roof designed to protect your colony from the elements. Quality construction ensures long-term durability and bee comfort.",
    features: [
      "Waterproof design with excellent drainage",
      "Insulated to regulate hive temperature",
      "Secure fit prevents wind damage",
      "Durable materials for all-season use"
    ]
  },
  "Boards & Excluders": {
    desc: "Essential hive management tool for controlling bee movement and optimizing honey production. Precision-manufactured for perfect fit and function.",
    features: [
      "Accurate spacing for optimal bee passage",
      "Durable construction for long-term use",
      "Easy to clean and maintain",
      "Compatible with standard hive dimensions"
    ]
  },
  "Frames & Foundation": {
    desc: "Quality beekeeping frames and foundation for strong comb building and efficient honey production. Made to professional beekeeping standards.",
    features: [
      "Precision-cut grooves for secure foundation",
      "High-quality wiring for comb support",
      "Food-safe wax foundation",
      "Easy to assemble and install"
    ]
  },
  "Extraction & Honey": {
    desc: "Professional honey extraction equipment for efficient honey harvesting. Built for both hobbyist and commercial beekeepers.",
    features: [
      "Robust construction for years of service",
      "Easy to clean food-grade materials",
      "Efficient honey extraction design",
      "Suitable for multiple frame sizes"
    ]
  },
  "Queen Rearing": {
    desc: "Specialized equipment for successful queen rearing and colony breeding. Essential tools for expanding and improving your bee stock.",
    features: [
      "Precision-designed for queen acceptance",
      "Easy to monitor and manage",
      "Compatible with standard hive equipment",
      "Durable construction for repeated use"
    ]
  },
  "Apparel": {
    desc: "Professional beekeeping protective clothing designed for comfort and safety. High-quality materials provide excellent sting protection while maintaining breathability.",
    features: [
      "Multi-layer sting protection fabric",
      "Reinforced high-risk areas",
      "Breathable mesh panels for ventilation",
      "Machine washable for easy care"
    ]
  },
  "Footwear": {
    desc: "Durable beekeeping footwear providing protection and comfort during hive inspections. Essential for safe apiary work in all conditions.",
    features: [
      "Waterproof construction",
      "Chemical-resistant materials",
      "Non-slip sole for safety",
      "Easy to clean and maintain"
    ]
  },
  "Accessories": {
    desc: "Essential beekeeping accessory to complement your hive management toolkit. Quality construction and practical design for everyday use.",
    features: [
      "Durable materials for long-term use",
      "Practical design for ease of use",
      "Compatible with standard equipment",
      "Easy to clean and maintain"
    ]
  },
  "Misc": {
    desc: "Quality beekeeping supply item for specialized hive management needs. Carefully selected for reliability and practicality.",
    features: [
      "Professional-grade construction",
      "Versatile and practical design",
      "Durable materials",
      "Easy to use and maintain"
    ]
  }
};

// Read the products file
const productsPath = path.join(__dirname, 'src', 'data', 'products.ts');
let content = fs.readFileSync(productsPath, 'utf-8');

// Function to add description and features to singleVariant calls
function addToSingleVariant(match, indent, id, name, category, price, stock, msrp, notes, imageSrc) {
  const cat = category.replace(/"/g, '').replace(/'/g, '');
  const data = categoryData[cat] || categoryData["Misc"];
  
  // Build the parameters
  const params = [id, name, category, price, stock];
  if (msrp !== undefined) params.push(msrp);
  else params.push('undefined');
  
  if (notes !== undefined) params.push(notes);
  else params.push('undefined');
  
  if (imageSrc !== undefined) params.push(imageSrc);
  else params.push('undefined');
  
  // Add description and features
  params.push(`"${data.desc}"`);
  params.push(`[\n${indent}    "${data.features.join(`",\n${indent}    "`)}"\n${indent}  ]`);
  
  return `${indent}singleVariant(\n${indent}  ${params.join(`,\n${indent}  `)}\n${indent})`;
}

// Replace singleVariant calls - handle various formatting patterns
content = content.replace(
  /^( *)singleVariant\(\s*\n?\s*([^,]+),\s*\n?\s*([^,]+),\s*\n?\s*([^,]+),\s*\n?\s*([^,]+),\s*\n?\s*([^,]+)(?:,\s*\n?\s*([^,\)]+))?(?:,\s*\n?\s*([^,\)]+))?(?:,\s*\n?\s*([^,\)]+))?\s*\)/gm,
  addToSingleVariant
);

// Also handle inline singleVariant calls
content = content.replace(
  /^( *)singleVariant\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+)(?:,\s*([^,\)]+))?(?:,\s*([^,\)]+))?(?:,\s*([^,\)]+))?\),?$/gm,
  (match, indent, id, name, category, price, stock, msrp, notes, imageSrc) => {
    const cat = category.replace(/"/g, '').replace(/'/g, '').trim();
    const data = categoryData[cat] || categoryData["Misc"];
    
    const params = [id, name, category, price, stock];
    if (msrp) params.push(msrp);
    else params.push('undefined');
    
    if (notes) params.push(notes);
    else params.push('undefined');
    
    if (imageSrc) params.push(imageSrc);
    else params.push('undefined');
    
    params.push(`"${data.desc}"`);
    params.push(`[${data.features.map(f => `"${f}"`).join(', ')}]`);
    
    return `${indent}singleVariant(${params.join(', ')})${match.endsWith(',') ? ',' : ''}`;
  }
);

// Write back
fs.writeFileSync(productsPath, content, 'utf-8');
console.log('✓ Updated all singleVariant products with descriptions and features');
